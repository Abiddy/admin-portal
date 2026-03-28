import path from "path";

export const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

/** Resolve a stored fileKey to an absolute path, or null if unsafe. */
export function resolveSafeUploadPath(fileKey: string): string | null {
  const normalized = fileKey.replace(/\\/g, "/");
  if (normalized.includes("..") || !normalized.startsWith("results/")) {
    return null;
  }
  const root = path.resolve(UPLOAD_ROOT);
  const full = path.resolve(root, normalized);
  const rel = path.relative(root, full);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    return null;
  }
  return full;
}
