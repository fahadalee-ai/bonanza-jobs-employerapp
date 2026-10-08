const memory = new Map<string, string>();

function box(session: boolean): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return session ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function readStorage(key: string, session = false): string | null {
  const store = box(session);
  if (!store) return memory.get(`${session ? "s" : "l"}:${key}`) ?? null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, session = false) {
  const memKey = `${session ? "s" : "l"}:${key}`;
  memory.set(memKey, value);
  const store = box(session);
  if (!store) return;
  try {
    store.setItem(key, value);
  } catch {
    /* private mode */
  }
}

export function clearStorage(key: string, session = false) {
  memory.delete(`${session ? "s" : "l"}:${key}`);
  const store = box(session);
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    /* private mode */
  }
}
