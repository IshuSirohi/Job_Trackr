import React, { useEffect, useState, useRef } from "react";
import {
  createFolder,
  getFolders,
  deleteFolder,
  renameFolder,
  addFilesToFolder,
  getFilesInFolder,
  deleteFile,
  getFile,
} from "../utils/IdbDocs";

export default function Documents() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameInput, setRenameInput] = useState("");

  const [viewer, setViewer] = useState(null);
  const [zoom, setZoom] = useState(1);

  const [search, setSearch] = useState("");

  // ⭐ Delete confirmation modal
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    folderId: null,
    folderName: "",
  });

  const dropRef = useRef(null);

  // -------------------------------
  // LOAD FOLDERS ON START
  // -------------------------------
  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    const f = await getFolders();
    setFolders(f);
  }

  useEffect(() => {
    if (selectedFolder) loadFiles(selectedFolder);
    else setFiles([]);
  }, [selectedFolder]);

  async function loadFiles(folderId) {
    const list = await getFilesInFolder(folderId);
    setFiles(list);
  }

  // -------------------------------
  // CREATE FOLDER
  // -------------------------------
  async function handleAddFolder(e) {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const folder = await createFolder(newFolderName.trim());
    setFolders([folder, ...folders]);
    setNewFolderName("");
  }

  // -------------------------------
  // RENAME FOLDER
  // -------------------------------
  async function handleRenameFolder(folderId) {
    if (!renameInput.trim()) return;

    await renameFolder(folderId, renameInput.trim());
    setRenameInput("");
    loadFolders();
  }

  // -------------------------------
  // FILE UPLOAD
  // -------------------------------
  async function handleUploadFiles(e) {
    const selectedFiles = e.target.files;
    if (!selectedFiles.length || !selectedFolder) return;

    await addFilesToFolder(selectedFolder, selectedFiles);
    loadFiles(selectedFolder);

    e.target.value = ""; // reset input
  }

  // -------------------------------
  // DRAG & DROP
  // -------------------------------
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const prevent = (e) => e.preventDefault();

    const handleDrop = async (e) => {
      e.preventDefault();
      if (!selectedFolder) return;

      const dtfiles = e.dataTransfer.files;
      if (dtfiles.length) {
        await addFilesToFolder(selectedFolder, dtfiles);
        loadFiles(selectedFolder);
      }
    };

    dropArea.addEventListener("dragover", prevent);
    dropArea.addEventListener("dragenter", prevent);
    dropArea.addEventListener("drop", handleDrop);

    return () => {
      dropArea.removeEventListener("dragover", prevent);
      dropArea.removeEventListener("dragenter", prevent);
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, [selectedFolder]);

  // -------------------------------
  // VIEWER MODAL
  // -------------------------------
  async function openViewer(fileId) {
    const file = await getFile(fileId);
    const blobURL = URL.createObjectURL(file.blob);

    setViewer({ ...file, url: blobURL });
    setZoom(1);
  }

  function closeViewer() {
    if (viewer?.url) URL.revokeObjectURL(viewer.url);
    setViewer(null);
  }

  // SEARCH FILTER
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-700 via-indigo-900 to-black text-white">

      <h1 className="text-3xl font-bold mb-6">📂 Documents Manager</h1>

      {/* CREATE FOLDER */}
      <form onSubmit={handleAddFolder} className="flex gap-3 mb-6">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name..."
          className="px-3 py-2 rounded bg-white/20 w-64"
        />
        <button className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500">
          Create Folder
        </button>
      </form>

      {/* FOLDER GRID */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-10">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`relative cursor-pointer flex flex-col items-center p-3 rounded 
              ${selectedFolder === folder.id ? "bg-white/30" : "bg-white/10 hover:bg-white/20"}`}
          >
            <div onClick={() => setSelectedFolder(folder.id)} className="text-6xl">
              📁
            </div>
            <p className="mt-2 text-center text-sm">{folder.name}</p>

            {/* RENAME INPUT */}
            {selectedFolder === folder.id && (
              <div className="mt-2 w-full">
                <input
                  className="w-full px-2 py-1 rounded bg-white/20 text-sm"
                  placeholder="Rename folder..."
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleRenameFolder(folder.id)
                  }
                />
              </div>
            )}

            {/* DELETE FOLDER BUTTON */}
            <button
              className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded text-xs"
              onClick={() =>
                setConfirmDelete({
                  show: true,
                  folderId: folder.id,
                  folderName: folder.name,
                })
              }
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* SELECT FOLDER MESSAGE */}
      {!selectedFolder && (
        <p className="text-white opacity-70 text-lg">
          📁 Select a folder to view documents
        </p>
      )}

      {/* SEARCH FILES */}
      {selectedFolder && (
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded bg-white/20 mb-4 w-64"
        />
      )}

      {/* UPLOAD AREA */}
      {selectedFolder && (
        <div ref={dropRef} className="mb-4 p-4 border-2 border-dashed border-white/40 rounded-lg text-center">
          <p className="mb-2">Drag & drop files here</p>
          <input type="file" multiple onChange={handleUploadFiles} />
        </div>
      )}

      {/* FILE GRID */}
      {selectedFolder && (
        <div className="grid md:grid-cols-3 gap-4">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-4 bg-white/20 rounded shadow hover:bg-white/30 cursor-pointer"
                onClick={() => openViewer(file.id)}
              >
                {/* Thumbnail */}
                {file.type.includes("image") ? (
                  <img
                    src={URL.createObjectURL(file.blob)}
                    className="h-32 w-full object-cover rounded mb-2"
                  />
                ) : (
                  <div className="h-32 w-full bg-black/40 flex items-center justify-center rounded mb-2">
                    📄 PDF
                  </div>
                )}

                <p className="font-semibold">{file.name}</p>
                <p className="text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ))
          ) : (
            <p className="opacity-50">No files found.</p>
          )}
        </div>
      )}

      {/* VIEWER MODAL */}
      {viewer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-black rounded-lg p-4 w-[90%] h-[90%] overflow-hidden">

            {/* Close */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 text-3xl bg-white/20 px-3 rounded-full"
            >
              ✖
            </button>

            {/* Zoom Buttons */}
            <div className="absolute top-4 left-4 flex gap-3">
              <button onClick={() => setZoom((z) => z + 0.2)} className="px-3 py-1 bg-white text-black rounded">➕</button>
              <button onClick={() => setZoom((z) => Math.max(1, z - 0.2))} className="px-3 py-1 bg-white text-black rounded">➖</button>
            </div>

            <div className="w-full h-full flex items-center justify-center overflow-auto">
              {viewer.type.includes("pdf") ? (
                <iframe
                  src={viewer.url}
                  className="w-full h-full rounded"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                ></iframe>
              ) : (
                <img
                  src={viewer.url}
                  className="max-w-none rounded"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 border border-white/20 p-6 rounded-xl shadow-xl w-full max-w-sm text-center animate-fadeIn">

            <h2 className="text-xl font-bold text-white mb-4">Delete Folder?</h2>

            <p className="text-white mb-6 opacity-90">
              Are you sure you want to delete
              <span className="font-semibold text-red-300">
                {" "}
                "{confirmDelete.folderName}"
              </span>
              ?
              <br />
              All documents inside will be removed.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete({ show: false })}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await deleteFolder(confirmDelete.folderId);
                  await loadFolders();

                  if (selectedFolder === confirmDelete.folderId) {
                    setSelectedFolder(null);
                  }

                  setConfirmDelete({ show: false });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
