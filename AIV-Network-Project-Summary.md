# AIV Network Project Summary (to date)

## Project Overview
AIV Network is a Netflix-style video streaming web application built with **Next.js 16 (App Router + Turbopack)** and deployed on **Vercel**.  
It uses **Cloudinary** as the video hosting and delivery platform, with automatic format and quality selection for browser compatibility.

---

## Current Tech Stack
- **Frontend Framework:** Next.js 16.0.10 (App Router)
- **Styling:** Tailwind CSS
- **Video Hosting:** Cloudinary
- **Deployment:** Vercel
- **Local Dev:** Node.js + npm

---

## Directory Structure
```
aiv-network/
├─ app/
│  ├─ page.js                # Home page
│  ├─ layout.js              # Root layout
│  ├─ globals.css            # Global styles
│  ├─ components/
│  │  ├─ Nav.js
│  │  ├─ Hero.js
│  │  └─ Row.js
│  └─ watch/
│     └─ [id]/
│        └─ page.js          # Video playback page
│
├─ lib/
│  └─ mockCatalog.js         # Mock catalog data
│
├─ .env.local                # Local environment variables
```

---

## Key Features Implemented
### 1. Home Page
- Netflix-style rows of content
- Data driven by `lib/mockCatalog.js`
- Clickable items route to `/watch/[id]`

### 2. Watch Page
- Dynamic route: `/watch/[id]`
- Uses Cloudinary video URLs
- Browser-compatible playback using:
  - `f_auto` (format auto-selection)
  - `q_auto` (quality auto-selection)

### 3. Cloudinary Integration
Environment variable:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbefmxqss
```

Video URL pattern used in app:
```
https://res.cloudinary.com/<cloud_name>/video/upload/f_auto,q_auto/<public_id>
```

This avoids browser playback issues caused by forcing `.mp4` extensions.

---

## Major Issues Resolved
- ❌ Broken imports and incorrect paths
- ❌ Vercel deploying old commit hashes
- ❌ Missing environment variables
- ❌ Invalid JSX / parsing errors
- ❌ Cloudinary video not playing (fixed by removing forced `.mp4`)
- ❌ Safari autoplay and MIME-type issues

---

## Current Status
✅ App builds locally  
✅ App runs locally on `localhost:3000`  
✅ Video routes resolve correctly  
✅ Cloudinary videos play in browser  
⚠️ Needs polish for consumer readiness

---

## Next Steps (Consumer-Ready Roadmap)
1. **Playback UX**
   - Loading spinner
   - Error fallback UI
   - Poster images

2. **Catalog**
   - Replace mockCatalog with real CMS or API
   - Thumbnails stored in Cloudinary

3. **Navigation**
   - Dedicated film detail pages
   - Improved back/forward handling

4. **Performance**
   - Lazy loading rows
   - Video prefetch strategy

5. **Deployment**
   - Add env vars in Vercel
   - Clean production build
   - Custom domain

---

## Notes
- The project is now technically sound.
- Remaining work is UX, polish, and content scaling.
- Foundation is solid for a consumer-facing streaming MVP.
