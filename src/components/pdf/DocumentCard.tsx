import { useState } from "react";
import {
  FileText,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileWarning,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatFileSize } from "@/utils/pdfExtractor";
import type { LibraryItem } from "@/types";

interface DocumentCardProps {
  document: LibraryItem;
  onRemove: (id: string) => void;
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "just now";
}

const statusConfig: Record<
  LibraryItem["status"],
  { badge: "cyan" | "gold" | "rose" | "slate"; label: string; icon: typeof FileText }
> = {
  processing: { badge: "cyan", label: "Processing", icon: Loader2 },
  ready: { badge: "gold", label: "Ready", icon: CheckCircle2 },
  error: { badge: "rose", label: "Error", icon: AlertCircle },
  "low-text": { badge: "slate", label: "Low Text", icon: FileWarning },
};

export function DocumentCard({ document: doc, onRemove }: DocumentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const status = statusConfig[doc.status];
  const StatusIcon = status.icon;

  return (
    <div className="rounded-xl border border-midnight-700/40 bg-midnight-800/40 transition-all hover:border-violet-500/30">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Icon */}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-midnight-700/50">
          {doc.status === "processing" ? (
            <StatusIcon className="h-4 w-4 animate-spin text-cyan-400" />
          ) : doc.status === "ready" ? (
            <FileText className="h-4 w-4 text-violet-300" />
          ) : doc.status === "error" ? (
            <StatusIcon className="h-4 w-4 text-rose-400" />
          ) : (
            <StatusIcon className="h-4 w-4 text-slate-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-slate-200">{doc.title}</p>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(doc.uploadedAt)}
            </span>
            {doc.fileSize && (
              <span className="text-xs text-slate-500">{formatFileSize(doc.fileSize)}</span>
            )}
            {doc.pageCount !== undefined && (
              <span className="text-xs text-slate-500">{doc.pageCount} pages</span>
            )}
            <Badge color={status.badge}>{status.label}</Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {doc.textPreview && doc.status === "ready" && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-midnight-700/50 hover:text-slate-200 transition-all"
              aria-label={expanded ? "Collapse preview" : "Expand preview"}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
          {!confirmRemove ? (
            <button
              onClick={() => setConfirmRemove(true)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/15 hover:text-rose-400 transition-all"
              aria-label="Remove document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onRemove(doc.id)}
                className="rounded-lg bg-rose-500/20 px-2 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500/30 transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmRemove(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-200 transition-all"
                aria-label="Cancel removal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Text Preview */}
      {expanded && doc.textPreview && (
        <div className="border-t border-midnight-700/40 px-4 py-3 animate-fade-in">
          <p className="mb-1 text-xs font-medium text-slate-500">Extracted text preview:</p>
          <p className="max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-400">
            {doc.textPreview}
          </p>
        </div>
      )}

      {/* Error / Low-text Message */}
      {doc.errorMessage && doc.status !== "ready" && (
        <div
          className={`border-t border-midnight-700/40 px-4 py-3 ${
            doc.status === "low-text" ? "bg-gold-500/5" : "bg-rose-500/5"
          }`}
        >
          <p
            className={`text-xs leading-relaxed ${
              doc.status === "low-text" ? "text-gold-200/80" : "text-rose-300/80"
            }`}
          >
            {doc.errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}
