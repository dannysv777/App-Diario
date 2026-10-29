import type { DiaryEntry, DiaryRepository } from "@/lib/diary-repository";

// Deliberately separate from the real album: no migration or shared writes.
async function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("nuestro-jardin-proposal-only", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("entries", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function write(operation: (store: IDBObjectStore) => void) {
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("entries", "readwrite");
      operation(tx.objectStore("entries"));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error("No se pudo guardar la página de prueba."));
    });
  } finally { db.close(); }
}

export const previewRepository: DiaryRepository = {
  async list() {
    const db = await database();
    try {
      return await new Promise<DiaryEntry[]>((resolve, reject) => {
        const request = db.transaction("entries").objectStore("entries").getAll();
        request.onsuccess = () => resolve((request.result as DiaryEntry[]).sort((a, b) => (b.sortOrder ?? 0) - (a.sortOrder ?? 0)));
        request.onerror = () => reject(request.error);
      });
    } finally { db.close(); }
  },
  save: entry => write(store => { store.put(entry); }),
  remove: id => write(store => { store.delete(id); }),
};
