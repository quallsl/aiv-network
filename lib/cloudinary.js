export function normalizePublicId(publicId) {
  if (!publicId) return []
  const id = String(publicId).trim()
  if (!id) return []

  const candidates = [id]

  // If API gives "wonderboy", also try your likely Cloudinary patterns
  if (!id.includes("/") && !id.startsWith("aiv-films")) {
    candidates.push(`aiv-films-${id}`)
    candidates.push(`aiv-films/${id}`)
  }

  return [...new Set(candidates)]
}

export function cloudinaryImageCandidates(cloudName, publicId) {
  if (!cloudName || !publicId) return []
  return normalizePublicId(publicId).map(
    (pid) => `https://res.cloudinary.com/${cloudName}/image/upload/${pid}`
  )
}

export function cloudinaryVideoCandidates(cloudName, publicId) {
  if (!cloudName || !publicId) return []
  return normalizePublicId(publicId).map(
    (pid) => `https://res.cloudinary.com/${cloudName}/video/upload/${pid}`
  )
}

// Convenience: return the first candidate URL.
// (We’ll add runtime fallback via onError in the page.)
export function cloudinaryImage(cloudName, publicId) {
  const urls = cloudinaryImageCandidates(cloudName, publicId)
  return urls[0] || null
}

export function cloudinaryVideo(cloudName, publicId) {
  const urls = cloudinaryVideoCandidates(cloudName, publicId)
  return urls[0] || null
}
