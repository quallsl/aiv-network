#!/usr/bin/env node
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const REQUIRED = [
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
for (const k of REQUIRED) {
  if (!process.env[k]) {
    console.error(`Missing env var: ${k} (check .env.local)`);
    process.exit(1);
  }
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const argv = yargs(hideBin(process.argv))
  .command("$0", "Add an item to AIV catalog and upload assets to Cloudinary")
  .option("row", { type: "string", demandOption: true, describe: "Row id (e.g., featured, trailers, shows)" })
  .option("title", { type: "string", demandOption: true, describe: "Title to display" })
  .option("poster", { type: "string", describe: "Path to poster image (jpg/png/webp)" })
  .option("video", { type: "string", describe: "Path to feature video (mp4/mov)" })
  .option("trailer", { type: "string", describe: "Path to trailer video (mp4/mov)" })
  .option("catalog", { type: "string", default: "app/data/catalog.json", describe: "Catalog json path" })
  .option("folder", { type: "string", default: process.env.CLOUDINARY_FOLDER || "aiv-films", describe: "Cloudinary folder" })
  .help()
  .parseSync();

function ensureFile(p) {
  const full = path.resolve(process.cwd(), p);
  if (!fs.existsSync(full)) {
    console.error(`File not found: ${p}`);
    process.exit(1);
  }
  return full;
}

async function uploadAsset(localPath, resourceType, folder, publicIdBase) {
  const res = await cloudinary.uploader.upload(localPath, {
    resource_type: resourceType, // "image" or "video"
    folder,
    public_id: publicIdBase,
    overwrite: true,
  });
  return res.secure_url;
}

function readCatalog(catalogPath) {
  const full = path.resolve(process.cwd(), catalogPath);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, JSON.stringify({ rows: [] }, null, 2));
  }
  return { full, data: JSON.parse(fs.readFileSync(full, "utf8")) };
}

function upsertRow(rows, rowId) {
  let row = rows.find((r) => r.id === rowId);
  if (!row) {
    row = { id: rowId, title: rowId[0].toUpperCase() + rowId.slice(1), items: [] };
    rows.push(row);
  }
  if (!Array.isArray(row.items)) row.items = [];
  return row;
}

(async () => {
  const posterPath = argv.poster ? ensureFile(argv.poster) : null;
  const videoPath = argv.video ? ensureFile(argv.video) : null;
  const trailerPath = argv.trailer ? ensureFile(argv.trailer) : null;

  const slug = slugify(argv.title, { lower: true, strict: true });
  const uid = nanoid(6);
  const baseId = `${slug}-${uid}`;

  const folder = argv.folder;

  let posterUrl = "";
  let featureUrl = "";
  let trailerUrl = "";

  if (posterPath) {
    posterUrl = await uploadAsset(posterPath, "image", folder, `${baseId}-poster`);
    console.log("Poster uploaded:", posterUrl);
  }
  if (videoPath) {
    featureUrl = await uploadAsset(videoPath, "video", folder, `${baseId}-feature`);
    console.log("Feature uploaded:", featureUrl);
  }
  if (trailerPath) {
    trailerUrl = await uploadAsset(trailerPath, "video", folder, `${baseId}-trailer`);
    console.log("Trailer uploaded:", trailerUrl);
  }

  const { full, data } = readCatalog(argv.catalog);
  if (!data.rows) data.rows = [];

  const row = upsertRow(data.rows, argv.row);

  const item = {
    id: baseId,
    title: argv.title,
    poster: posterUrl || "",
    feature: featureUrl || "",
    trailer: trailerUrl || ""
  };

  row.items.unshift(item);

  fs.writeFileSync(full, JSON.stringify(data, null, 2));
  console.log(`✅ Added to catalog: ${argv.row} → ${argv.title}`);
  console.log(`✅ Updated: ${path.relative(process.cwd(), full)}`);
})().catch((e) => {
  console.error("Upload failed:", e?.message || e);
  process.exit(1);
});
