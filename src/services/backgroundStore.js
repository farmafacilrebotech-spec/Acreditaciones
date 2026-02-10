import { v4 as uuidv4 } from 'uuid';

const TTL_MS = 30 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

const store = new Map();

const cleanupExpired = () => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.expiresAt <= now) {
      store.delete(key);
    }
  }
};

setInterval(cleanupExpired, CLEANUP_INTERVAL_MS).unref();

export const saveBackground = (buffer, mimeType) => {
  const backgroundId = uuidv4();
  store.set(backgroundId, {
    buffer,
    mimeType,
    expiresAt: Date.now() + TTL_MS,
  });
  return backgroundId;
};

export const getBackground = (backgroundId) => {
  const entry = store.get(backgroundId);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(backgroundId);
    return null;
  }
  return entry;
};

