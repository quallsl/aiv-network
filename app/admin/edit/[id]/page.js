"use client";

import { useEffect, useState } from "react";

export default function EditFilmPage({ params }) {
const { id } = params;

const [film, setFilm] = useState({
title: "",
creator: "",
description: "",
genre: "",
rating: "",
runtime: "",
poster_url: "",
thumbnail_url: "",
video_url: "",
trending: false,
new_release: false,
aiv_original: false,
});

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

useEffect(() => {
async function loadFilm() {
try {
const res = await fetch(`/api/films/edit/${id}`);
const data = await res.json();

```
    if (data) {
      setFilm(data);
    }
  } catch (err) {
    console.error(err);
  }

  setLoading(false);
}

loadFilm();
```

}, [id]);

const saveFilm = async () => {
try {
setSaving(true);

```
  const res = await fetch(`/api/films/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(film),
  });

  if (!res.ok) {
    throw new Error("Failed to save");
  }

  alert("Film updated successfully");

  window.location.href = "/";
} catch (err) {
  console.error(err);
  alert("Save failed");
}

setSaving(false);
```

};

if (loading) {
return (
<div style={{ padding: 40, color: "#fff" }}>
Loading... </div>
);
}

return (
<div
style={{
background: "#000",
minHeight: "100vh",
color: "#fff",
padding: "40px",
}}
> <h1>Edit Film</h1>

```
  <div style={{ maxWidth: "700px" }}>
    <label>Title</label>
    <input
      value={film.title || ""}
      onChange={(e) =>
        setFilm({ ...film, title: e.target.value })
      }
      style={styles.input}
    />

    <label>Creator</label>
    <input
      value={film.creator || ""}
      onChange={(e) =>
        setFilm({ ...film, creator: e.target.value })
      }
      style={styles.input}
    />

    <label>Description</label>
    <textarea
      value={film.description || ""}
      onChange={(e) =>
        setFilm({ ...film, description: e.target.value })
      }
      style={styles.textarea}
    />

    <label>Genre</label>
    <input
      value={film.genre || ""}
      onChange={(e) =>
        setFilm({ ...film, genre: e.target.value })
      }
      style={styles.input}
    />

    <label>Rating</label>
    <input
      value={film.rating || ""}
      onChange={(e) =>
        setFilm({ ...film, rating: e.target.value })
      }
      style={styles.input}
    />

    <label>Runtime</label>
    <input
      value={film.runtime || ""}
      onChange={(e) =>
        setFilm({ ...film, runtime: e.target.value })
      }
      style={styles.input}
    />

    <label>Poster URL</label>
    <input
      value={film.poster_url || ""}
      onChange={(e) =>
        setFilm({ ...film, poster_url: e.target.value })
      }
      style={styles.input}
    />

    <label>Thumbnail URL</label>
    <input
      value={film.thumbnail_url || ""}
      onChange={(e) =>
        setFilm({ ...film, thumbnail_url: e.target.value })
      }
      style={styles.input}
    />

    <label>Video URL</label>
    <input
      value={film.video_url || ""}
      onChange={(e) =>
        setFilm({ ...film, video_url: e.target.value })
      }
      style={styles.input}
    />

    <div style={{ marginTop: 20 }}>
      <label>
        <input
          type="checkbox"
          checked={film.trending || false}
          onChange={(e) =>
            setFilm({
              ...film,
              trending: e.target.checked,
            })
          }
        />
        Trending
      </label>
    </div>

    <div>
      <label>
        <input
          type="checkbox"
          checked={film.new_release || false}
          onChange={(e) =>
            setFilm({
              ...film,
              new_release: e.target.checked,
            })
          }
        />
        New Release
      </label>
    </div>

    <div>
      <label>
        <input
          type="checkbox"
          checked={film.aiv_original || false}
          onChange={(e) =>
            setFilm({
              ...film,
              aiv_original: e.target.checked,
            })
          }
        />
        AIV Original
      </label>
    </div>

    <button
      onClick={saveFilm}
      disabled={saving}
      style={styles.saveButton}
    >
      {saving ? "Saving..." : "Save Film"}
    </button>
  </div>
</div>
```

);
}

const styles = {
input: {
width: "100%",
padding: "10px",
marginBottom: "15px",
background: "#111",
color: "#fff",
border: "1px solid #333",
},

textarea: {
width: "100%",
height: "120px",
padding: "10px",
marginBottom: "15px",
background: "#111",
color: "#fff",
border: "1px solid #333",
},

saveButton: {
marginTop: "20px",
padding: "12px 24px",
background: "#e50914",
color: "#fff",
border: "none",
cursor: "pointer",
borderRadius: "4px",
},
};
