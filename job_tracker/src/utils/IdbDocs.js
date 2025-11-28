import { openDB } from "idb";

const DB_NAME = "documentsDB";
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("folders")) {
        db.createObjectStore("folders", { keyPath: "id", autoIncrement: true });
      }

      if (!db.objectStoreNames.contains("files")) {
        const store = db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
        store.createIndex("folderId", "folderId");
      }
    },
  });
}

// --------------------
// FOLDER FUNCTIONS
// --------------------

export async function createFolder(name) {
  const db = await initDB();
  const id = await db.add("folders", { name });
  return { id, name };
}

export async function getFolders() {
  const db = await initDB();
  return db.getAll("folders");
}

export async function deleteFolder(folderId) {
  const db = await initDB();
  await db.delete("folders", folderId);

  // delete files inside folder
  const tx = db.transaction("files", "readwrite");
  const index = tx.store.index("folderId");
  let cursor = await index.openCursor(folderId);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
}

// ⭐ FIX: RENAME FOLDER
export async function renameFolder(folderId, newName) {
  const db = await initDB();
  return db.put("folders", { id: folderId, name: newName });
}

// --------------------
// FILE FUNCTIONS
// --------------------

export async function addFilesToFolder(folderId, files) {
  const db = await initDB();

  const tx = db.transaction("files", "readwrite");

  for (let file of files) {
    await tx.store.add({
      name: file.name,
      size: file.size,
      type: file.type,
      blob: file,
      folderId,
      createdAt: Date.now(),
    });
  }

  await tx.done;
}

export async function getFilesInFolder(folderId) {
  const db = await initDB();
  return db.getAllFromIndex("files", "folderId", folderId);
}

export async function deleteFile(fileId) {
  const db = await initDB();
  return db.delete("files", fileId);
}

export async function getFile(fileId) {
  const db = await initDB();
  return db.get("files", fileId);
}
