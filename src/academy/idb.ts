/**
 * Tiny IndexedDB blob store used by demo mode.
 *
 * localStorage cannot hold PDFs (5 MB quota, base64 bloat), so uploaded books
 * and homework files live in IndexedDB instead. Keys are opaque strings.
 */

const DB_NAME = 'ielts-academy-files';
const STORE = 'files';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (!idbAvailable()) {
    return Promise.reject(new Error('This browser is blocking local file storage.'));
  }
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open the file store.'));
  });
  return dbPromise;
}

function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = fn(tx.objectStore(STORE));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('File store error.'));
      }),
  );
}

export async function putBlob(key: string, blob: Blob): Promise<void> {
  await run('readwrite', (store) => store.put(blob, key));
}

export async function getBlob(key: string): Promise<Blob | null> {
  const value = await run<Blob | undefined>('readonly', (store) => store.get(key));
  return value ?? null;
}

export async function deleteBlob(key: string): Promise<void> {
  await run('readwrite', (store) => store.delete(key));
}

/** Best-effort availability check — private browsing modes can block IndexedDB. */
export function idbAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}
