/**
 * Shared formatting utilities to prevent code duplication across components.
 */

/**
 * Format an ISO date string into human-readable relative time (e.g., '2h ago', '3d ago', 'just now').
 */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "just now";
}

/**
 * Format file size in human-readable units.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generate a short preview of extracted text for display.
 */
export function createTextPreview(text: string, maxLength = 500): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
