export type ProductSettings = {
  minBulkKg?: number;
  [key: string]: unknown;
};

const STORAGE_KEY = "bhavnagar_product_settings";

function readSettings(): Record<string, ProductSettings> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ProductSettings>;
  } catch {
    return {};
  }
}

function writeSettings(data: Record<string, ProductSettings>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getProductSettings(productId: string): ProductSettings {
  const all = readSettings();
  return all[productId] ?? {};
}

export function setProductMinBulk(productId: string, minBulkKg: number | null) {
  const all = readSettings();
  const current = all[productId] ?? {};

  if (minBulkKg === null) {
    delete current.minBulkKg;
  } else {
    current.minBulkKg = minBulkKg;
  }

  if (Object.keys(current).length === 0) {
    delete all[productId];
  } else {
    all[productId] = current;
  }

  writeSettings(all);
}
