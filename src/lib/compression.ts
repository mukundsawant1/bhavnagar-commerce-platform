import pako from "pako";

/**
 * Helper utilities for storing order metadata in compressed form.
 *
 * Why this exists:
 * - Supabase JSONB storage counts every byte stored.
 * - Order metadata can grow quickly (items, buyer details, notes, timestamps).
 * - Compressing the metadata reduces storage usage and keeps costs down.
 *
 * The app uses a small marker object to detect compressed payloads. When
 * writing, we gzip + base64 encode the JSON. When reading, we automatically
 * decompress and expose the plain object.
 */
export type CompressedPayload = {
  __compressed: true;
  method: "gzip";
  data: string; // base64
};

export function compressMetadata(input: Record<string, unknown>): CompressedPayload {
  const json = JSON.stringify(input);
  const compressed = pako.gzip(json);
  const base64 = Buffer.from(compressed).toString("base64");
  return {
    __compressed: true,
    method: "gzip",
    data: base64,
  };
}

export function decompressMetadata(payload: unknown): Record<string, unknown> {
  // If the payload is not an object, there's nothing to decompress.
  if (typeof payload !== "object" || payload === null) {
    return {};
  }

  const maybe = payload as Record<string, unknown>;

  // The compressed format is a small wrapper object with a marker.
  // This allows us to store both compressed and uncompressed data in the same column.
  if (
    maybe["__compressed"] === true &&
    maybe["method"] === "gzip" &&
    typeof maybe["data"] === "string"
  ) {
    try {
      const bytes = Buffer.from(maybe["data"], "base64");
      const decompressed = pako.ungzip(bytes, { to: "string" });
      return JSON.parse(decompressed);
    } catch {
      // If decompression fails, return an empty object so consumer code can still work.
      return {};
    }
  }

  // If the payload isn't wrapped in our marker, just return it as-is.
  return payload as Record<string, unknown>;
}

export function ensureDecompressedMetadata(raw: unknown): Record<string, unknown> {
  const decompressed = decompressMetadata(raw);

  // If a caller has already decompressed the payload but the marker remains,
  // strip it to avoid leaking implementation details to the UI.
  if (typeof decompressed === "object" && decompressed !== null && "__compressed" in decompressed) {
    const decompressedObj = decompressed as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __compressed, ...rest } = decompressedObj;
    return rest;
  }

  return decompressed;
}

export function decompressOrder<T extends { metadata?: unknown }>(
  order: T,
): Omit<T, "metadata"> & { metadata: Record<string, unknown> } {
  return {
    ...order,
    metadata: ensureDecompressedMetadata(order.metadata),
  } as Omit<T, "metadata"> & { metadata: Record<string, unknown> };
}

export function decompressOrders<T extends { metadata?: unknown }>(
  orders: T[],
): Array<Omit<T, "metadata"> & { metadata: Record<string, unknown> }> {
  return orders.map((order) => decompressOrder(order));
}
