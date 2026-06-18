import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the Next.js basePath from runtime config.
 * Works for both client and server side.
 */
function getBasePath(): string {
  // In Next.js, the basePath is available via `process.env.NEXT_PUBLIC_BASE_PATH`
  // We hardcode it here to match next.config.ts for static export reliability.
  return "/life-complex-store"
}

/**
 * Resolve an asset path against the configured basePath.
 * Use this for any <img src>, CSS url(), or fetch() that references
 * a file in the /public folder.
 *
 * Example:
 *   <img src={asset("/images/products/phone.png")} />
 *   -> "/life-complex-store/images/products/phone.png"
 */
export function asset(path: string): string {
  if (!path) return path
  // Already absolute URL (https://, http://, //)
  if (/^(https?:)?\/\//i.test(path)) return path
  // Data URI
  if (path.startsWith("data:")) return path
  // Already prefixed with basePath
  const base = getBasePath()
  if (path.startsWith(base)) return path
  // Ensure path starts with /
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalized}`
}
