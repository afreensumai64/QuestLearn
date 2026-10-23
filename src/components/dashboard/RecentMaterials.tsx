import { FileText, Clock, Loader2, FileX2, Trash2, AlertCircle, CheckCircle2, FileWarning, Swords } from "lucide-react";
import { EmptyState } from "@/components/ui/states";
import { Badge } from "@/components/ui/Badge";
import { useLibraryStore } from "@/store/libraryStore";
import { formatRelativeTime, formatFileSize } from "@/utils/formatters";
import { EXTRACTION_STATUS_CONFIG } from "@/types/constants";
import { useGameStore } from "@/store/gameStore";
import type { LibraryItem } from "@/types";

interface RecentMaterialsProps {
  materials?: LibraryItem[];
  showRemove?: boolean;
  onRemove?: (id: string) => void;
}


export function RecentMaterials({ materials, showRemove = false, onRemove }: RecentMaterialsProps) {
  // If no materials prop is passed, use the live store
  const storeDocs = useLibraryStore((s) => s.documents);
  const docs = materials ?? storeDocs;
  const storeRemove = useLibraryStore((s) => s.removeDocument);
  const handleRemove = onRemove ?? storeRemove;
  const startBattle = useGameStore((s) => s.startBattle);

  if (docs.length === 0) {
    return (
      <div className="rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-200">Recent Study Materials</h3>
        <EmptyState
          icon={<FileX2 className="h-10 w-10" />}
          title="No materials uploaded"
          message="Upload PDF files to build your personal study library. They'll appear here."
        />
      </div>
    );
  }

  // Show up to 5 most recent
  const recentDocs = docs.slice(0, 5);

  return (
    <div className="rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 backdrop-blur-sm animate-slide-up">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-200">Recent Study Materials</h3>
        <Badge color="slate">{docs.length}</Badge>
      </div>

      <div className="space-y-2">
        {recentDocs.map((item) => {
          const badge = EXTRACTION_STATUS_CONFIG[item.status];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-midnight-700/40 bg-midnight-800/40 px-4 py-3 transition-all hover:border-violet-500/30 hover:bg-midnight-700/30"
            >
              {/* Icon */}
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-midnight-700/50">
                {item.status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />}
                {item.status === "ready" && <FileText className="h-4 w-4 text-violet-300" />}
                {item.status === "error" && <AlertCircle className="h-4 w-4 text-rose-400" />}
                {item.status === "low-text" && <FileWarning className="h-4 w-4 text-slate-400" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">{item.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(item.uploadedAt)}
                  </span>
                  {item.fileSize && (
                    <span className="text-xs text-slate-500">{formatFileSize(item.fileSize)}</span>
                  )}
                  {item.pageCount !== undefined && (
                    <span className="text-xs text-slate-500">{item.pageCount}p</span>
                  )}
                  <Badge color={badge.color}>{badge.label}</Badge>
                </div>
              </div>

              {/* Quick Battle button */}
              {item.status === "ready" && (
                <button
                  onClick={() => startBattle(item)}
                  className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-2 py-1 text-xs font-bold text-white shadow-md shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 hover:scale-105 active:scale-95 transition-all"
                  title="Challenge Boss with this document"
                >
                  <Swords className="h-3 w-3" />
                  <span>Battle</span>
                </button>
              )}

              {/* Remove button */}
              {showRemove && (
                <button
                  onClick={() => handleRemove(item.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/15 hover:text-rose-400 transition-all"
                  aria-label="Remove document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              {/* Ready indicator */}
              {item.status === "ready" && !showRemove && (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-cyan-400/60" />
              )}
            </div>
          );
        })}
      </div>

      {docs.length > 5 && (
        <p className="mt-3 text-center text-xs text-slate-500">
          + {docs.length - 5} more in your library
        </p>
      )}
    </div>
  );
}
