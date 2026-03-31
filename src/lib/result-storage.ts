import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { resolveSafeUploadPath, UPLOAD_ROOT } from "@/lib/uploads";

/** When all three are set, PDFs are stored in Supabase Storage; downloads use signed URLs. Otherwise local `uploads/` (dev). */
export function isSupabaseResultStorageEnabled(): boolean {
  return Boolean(
    process.env.SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      process.env.SUPABASE_STORAGE_BUCKET?.trim(),
  );
}

function getBucket(): string {
  const b = process.env.SUPABASE_STORAGE_BUCKET?.trim();
  if (!b) throw new Error("SUPABASE_STORAGE_BUCKET is not set");
  return b;
}

let serviceClient: SupabaseClient | null = null;

function getServiceSupabase(): SupabaseClient {
  if (!serviceClient) {
    const url = process.env.SUPABASE_URL!.trim();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
    serviceClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return serviceClient;
}

/** Object path in bucket / relative path under uploads — also Prisma `fileKey`. */
export function resultPdfStoragePath(resultId: string): string {
  return `results/${resultId}.pdf`;
}

function assertSafeFileKey(fileKey: string): void {
  const n = fileKey.replace(/\\/g, "/");
  if (n.includes("..") || !n.startsWith("results/") || !n.endsWith(".pdf")) {
    throw new Error("Invalid file key");
  }
}

export async function persistResultPdf(fileKey: string, buffer: Buffer): Promise<void> {
  assertSafeFileKey(fileKey);
  if (isSupabaseResultStorageEnabled()) {
    const supabase = getServiceSupabase();
    const { error } = await supabase.storage.from(getBucket()).upload(fileKey, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });
    if (error) throw new Error(error.message);
    return;
  }
  const full = path.join(UPLOAD_ROOT, fileKey);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, buffer);
}

export async function removePersistedResultPdf(fileKey: string): Promise<void> {
  if (!fileKey || fileKey === "__pending__") return;
  assertSafeFileKey(fileKey);
  if (isSupabaseResultStorageEnabled()) {
    await getServiceSupabase().storage.from(getBucket()).remove([fileKey]);
    return;
  }
  const abs = resolveSafeUploadPath(fileKey);
  if (abs) await unlink(abs).catch(() => {});
}

/**
 * Private bucket: short-lived URL for the browser to download the PDF.
 * Returns null if Supabase is not configured (caller falls back to local disk).
 */
export async function createSignedResultDownloadUrl(
  fileKey: string,
  expiresInSeconds = 180,
): Promise<string | null> {
  if (!isSupabaseResultStorageEnabled()) return null;
  assertSafeFileKey(fileKey);
  try {
    const { data, error } = await getServiceSupabase()
      .storage.from(getBucket())
      .createSignedUrl(fileKey, expiresInSeconds);
    if (error || !data?.signedUrl) {
      console.error("[storage] createSignedUrl:", error?.message);
      return null;
    }
    return data.signedUrl;
  } catch (e) {
    console.error("[storage] createSignedUrl:", e);
    return null;
  }
}
