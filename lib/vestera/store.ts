// VESTERA — durable Pi user-state storage with debounced, rate-limit-aware writes.

export interface StoreRecord {
  blob: Record<string, unknown>;
  updatedAt?: number;
  version?: number;
}

export interface StoreApi {
  get: (key: string) => Promise<StoreRecord | null>;
  set: (key: string, blob: Record<string, unknown>) => Promise<void>;
}

// Session fallback used when the SDK is not present (e.g. App Studio preview iframe).
export function makeMemStore(): StoreApi {
  const mem = new Map<string, Record<string, unknown>>();
  return {
    async get(key) {
      const v = mem.get(key);
      return v ? { blob: v, updatedAt: Date.now(), version: 1 } : null;
    },
    async set(key, blob) {
      mem.set(key, blob);
    },
  };
}

interface SdkLike {
  state?: {
    get?: (key: string) => Promise<unknown>;
    set?: (key: string, blob: Record<string, unknown>) => Promise<unknown>;
  };
}

export function storeOf(sdk: unknown): StoreApi {
  const s = sdk as SdkLike | null;
  if (!s || !s.state || typeof s.state.get !== "function" || typeof s.state.set !== "function") {
    return makeMemStore();
  }
  return {
    async get(key) {
      const rec = await s.state!.get!(key);
      if (!rec || typeof rec !== "object") return null;
      return rec as StoreRecord;
    },
    async set(key, blob) {
      await s.state!.set!(key, blob);
    },
  };
}

// Per-key debounced writer with backoff on failure. Keeps last-good pending state so a
// rejected save never loses data.
export class KeyWriter {
  private store: StoreApi;
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private pending = new Map<string, () => Record<string, unknown>>();
  private inFlight = new Set<string>();
  private backoff = new Map<string, number>();
  private lastWrite = new Map<string, number>();
  private static lastAnyWrite = 0;
  private onTrouble?: (v: boolean) => void;

  constructor(store: StoreApi, onTrouble?: (v: boolean) => void) {
    this.store = store;
    this.onTrouble = onTrouble;
  }

  private debounceFor(key: string): number {
    return key.endsWith("prefs") ? 900 : 1000;
  }

  queue(key: string, builder: () => Record<string, unknown>, immediate = false) {
    this.pending.set(key, builder);
    const existing = this.timers.get(key);
    if (existing) clearTimeout(existing);
    const delay = immediate ? 0 : this.debounceFor(key);
    this.timers.set(
      key,
      setTimeout(() => this.flush(key), delay),
    );
  }

  now(key: string, builder: () => Record<string, unknown>) {
    this.queue(key, builder, true);
  }

  private async flush(key: string) {
    if (this.inFlight.has(key)) {
      // reschedule shortly
      this.timers.set(
        key,
        setTimeout(() => this.flush(key), 400),
      );
      return;
    }
    const builder = this.pending.get(key);
    if (!builder) return;

    const now = Date.now();
    const sinceKey = now - (this.lastWrite.get(key) ?? 0);
    const sinceAny = now - KeyWriter.lastAnyWrite;
    const minKey = 5200;
    const minAny = 1100;
    const wait = Math.max(minKey - sinceKey, minAny - sinceAny, 0);
    if (wait > 0) {
      this.timers.set(
        key,
        setTimeout(() => this.flush(key), wait),
      );
      return;
    }

    this.inFlight.add(key);
    const blob = builder();
    try {
      await this.store.set(key, blob);
      this.pending.delete(key);
      this.lastWrite.set(key, Date.now());
      KeyWriter.lastAnyWrite = Date.now();
      this.backoff.delete(key);
      this.onTrouble?.(false);
    } catch {
      // keep pending; retry with backoff
      const prev = this.backoff.get(key) ?? 3000;
      const next = Math.min(prev * 1.8, 30000);
      this.backoff.set(key, next);
      this.onTrouble?.(true);
      this.timers.set(
        key,
        setTimeout(() => this.flush(key), prev),
      );
    } finally {
      this.inFlight.delete(key);
    }
  }

  flushNow() {
    for (const key of this.pending.keys()) {
      const builder = this.pending.get(key);
      if (!builder) continue;
      try {
        void this.store.set(key, builder());
      } catch {
        /* best effort on unload */
      }
    }
  }
}
