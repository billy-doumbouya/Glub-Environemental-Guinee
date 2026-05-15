// src/services/googleDriveService.js

const BASE_URL = "https://www.googleapis.com/drive/v3/files";

const CACHE_KEY = "ceg_gallery_v3";
const CACHE_TTL = 1000 * 60 * 30;

// ───────────────────────
// IMAGE (STABLE GOOGLE DRIVE)
// ───────────────────────
function img(id, size = 1200) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
}

function imgFull(id) {
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

// ───────────────────────
// CACHE
// ───────────────────────
function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.time > CACHE_TTL) return null;

    return parsed.data;
  } catch {
    return null;
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data }));
  } catch (e) {
    console.warn("Cache error", e);
  }
}

// ───────────────────────
// FETCH
// ───────────────────────
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  return res.json();
}

async function fetchFiles(query, key) {
  const url =
    `${BASE_URL}?` +
    new URLSearchParams({
      q: query,
      key,
      pageSize: "1000",
      fields: "files(id,name,mimeType)",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });

  const data = await fetchJSON(url);
  return data.files || [];
}

// ───────────────────────
// MAIN
// ───────────────────────
export async function fetchGalleryImages({
  folderId,
  apiKey,
  forceRefresh = false,
}) {
  if (!folderId) throw new Error("folderId manquant");
  if (!apiKey) throw new Error("apiKey manquant");

  if (!forceRefresh) {
    const cached = getCache();
    if (cached) return cached;
  }

  // 1. folders
  const folders = await fetchFiles(
    `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    apiKey,
  );

  if (!folders.length) return [];

  // 2. images
  const results = await Promise.all(
    folders.map(async (folder, folderIndex) => {
      const files = await fetchFiles(
        `'${folder.id}' in parents and mimeType contains 'image/' and trashed=false`,
        apiKey,
      );

      return files.map((f, i) => ({
        id: f.id,
        title: f.name,
        category: folder.name,

        src: img(f.id, 1200),
        thumb: img(f.id, 500),
        full: imgFull(f.id),

        aspect: (folderIndex + i) % 6 === 0 ? "tall" : "normal",
      }));
    }),
  );

  const flat = results.flat();

  setCache(flat);
  return flat;
}
