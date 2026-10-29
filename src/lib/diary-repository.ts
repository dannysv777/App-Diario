export interface DiaryEntry {
  id: string;
  title: string;
  message: string;
  image?: string;
  createdAt: string;
  sortOrder?: number;
}

// Replace this adapter with a private HTTP API later; the album stays the same.
export interface DiaryRepository {
  list(): Promise<DiaryEntry[]>;
  save(entry: DiaryEntry): Promise<void>;
  remove(id: string): Promise<void>;
}

const storeName = "entries";
let database: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (!database) {
    database = new Promise((resolve, reject) => {
      const request = indexedDB.open("nuestro-jardin-album", 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(storeName, { keyPath: "id" });
        request.result.createObjectStore("metadata");
      };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); database = undefined; };
        resolve(db);
      };
      request.onerror = () => { database = undefined; reject(request.error); };
      request.onblocked = () => { database = undefined; reject(new Error("Cierra las otras pestañas del álbum y vuelve a intentarlo.")); };
    });
  }
  return database;
}

function isEntry(value: unknown): value is DiaryEntry {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return [item.id, item.title, item.message, item.createdAt].every(v => typeof v === "string")
    && (item.image === undefined || typeof item.image === "string");
}

async function migrateLegacy(db: IDBDatabase): Promise<void> {
  // The marker and entries commit together. Keep the original storage intact.
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([storeName, "metadata"], "readwrite");
    const meta = tx.objectStore("metadata");
    const marker = meta.get("legacy-imported");
    marker.onsuccess = () => {
      if (marker.result) return;
      try {
        const saved = window.localStorage.getItem("nuestro-jardin-diary-v2") ?? window.localStorage.getItem("nuestro-jardin-diary");
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (!Array.isArray(parsed) || !parsed.every(isEntry)) throw new Error("Invalid legacy album");
          parsed.forEach((entry, index) => tx.objectStore(storeName).put({ ...entry, sortOrder: parsed.length - index }));
        }
        meta.put(true, "legacy-imported");
      } catch { tx.abort(); }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("No se pudo importar el álbum. Los originales siguen guardados."));
  });
}

export const diaryRepository: DiaryRepository = {
  async list() {
    const db = await openDatabase();
    await migrateLegacy(db);
    return new Promise((resolve, reject) => {
      const request = db.transaction(storeName).objectStore(storeName).getAll();
      request.onsuccess = () => resolve((request.result as DiaryEntry[]).sort((a, b) => (b.sortOrder ?? 0) - (a.sortOrder ?? 0)));
      request.onerror = () => reject(request.error);
    });
  },
  async save(entry) {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put(entry);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error("No se pudo guardar."));
    });
  },
  async remove(id) {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error("No se pudo eliminar."));
    });
  },
};

export async function prepareDiaryPhoto(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) throw new Error("Elige una foto JPG, PNG o WebP. Convierte las fotos HEIC antes de subirlas.");
  if (file.size > 25 * 1024 * 1024) throw new Error("La foto debe pesar menos de 25 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    try { await image.decode(); }
    catch { throw new Error("No pudimos abrir esa foto. Comprueba que el archivo no esté dañado e intenta con otra imagen."); }
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo preparar la foto.");
    context.fillStyle = "#fffaf0";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally { URL.revokeObjectURL(url); }
}
