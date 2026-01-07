const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbefmxqss";

// Generate poster/backdrop from the video itself
// poster: first frame, vertical crop
export function posterFromVideo(watchId) {
  return `https://res.cloudinary.com/${CLOUD}/video/upload/so_0,c_fill,w_600,h_900,q_auto,f_auto/${watchId}.jpg`;
}

// backdrop: first frame, wide crop
export function backdropFromVideo(watchId) {
  return `https://res.cloudinary.com/${CLOUD}/video/upload/so_0,c_fill,w_1600,h_900,q_auto,f_auto/${watchId}.jpg`;
}

export const catalog = {
  hero: {
    title: "WonderBoy (Trailer)",
    synopsis: "A quick trailer test to verify Cloudinary playback.",
    year: "2026",
    duration: "0:30",
    tags: ["Trailer", "Original"],
    watchId: "aiv-films-wonderboy-trailer_vae68x",
  },

  rows: [
    {
      title: "AIV Originals",
      items: [
        {
          id: "wonderboy-trailer",
          title: "WonderBoy (Trailer)",
          synopsis: "Cloudinary playback test (real Cloudinary ID).",
          year: "2026",
          duration: "0:30",
          tags: ["Trailer"],
          watchId: "aiv-films-wonderboy-trailer_vae68x",
        },
      ],
    },
  ],
};

// attach poster/backdrop automatically so you never hand-type them
catalog.hero.poster = posterFromVideo(catalog.hero.watchId);
catalog.hero.backdrop = backdropFromVideo(catalog.hero.watchId);

catalog.rows.forEach((row) => {
  row.items.forEach((item) => {
    item.poster = item.poster || posterFromVideo(item.watchId);
    item.backdrop = item.backdrop || backdropFromVideo(item.watchId);
  });
});
