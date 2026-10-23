import { useRef, useState, useCallback } from "react";
import { Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  extractPdfText,
  validatePdfFile,
  formatFileSize,
  createTextPreview,
  type PdfExtractionProgress,
} from "@/utils/pdfExtractor";
import type { LibraryItem } from "@/types";

export interface PdfUploaderResult {
  document: LibraryItem;
}

interface PdfUploaderProps {
  maxSizeMB?: number;
  onExtracted: (doc: LibraryItem) => void;
}

type UploadState = "idle" | "processing" | "success" | "error" | "low-text";

interface UploadDisplay {
  fileName: string;
  fileSize: number;
  pageCount?: number;
  textPreview?: string;
  progress?: PdfExtractionProgress;
  errorMessage?: string;
}

export function PdfUploader({ maxSizeMB = 25, onExtracted }: PdfUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [display, setDisplay] = useState<UploadDisplay | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const reset = useCallback(() => {
    setState("idle");
    setDisplay(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      // Validate
      const validation = validatePdfFile(file, maxSizeMB);
      if (!validation.valid) {
        setState("error");
        setDisplay({ fileName: file.name, fileSize: file.size, errorMessage: validation.error });
        return;
      }

      setState("processing");
      setDisplay({ fileName: file.name, fileSize: file.size });

      // Extract text
      const result = await extractPdfText(file, (progress) => {
        setDisplay((prev) => ({
          ...prev,
          fileName: file.name,
          fileSize: file.size,
          progress,
        }));
      });

      const docId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const baseDoc: LibraryItem = {
        id: docId,
        title: file.name,
        type: "pdf",
        uploadedAt: new Date().toISOString(),
        content: result.text,
        status: result.status,
        errorMessage: result.errorMessage,
        fileSize: file.size,
        pageCount: result.pageCount,
        textPreview: createTextPreview(result.text),
        extractionStatus: result.status,
      };

      if (result.status === "ready") {
        setState("success");
        setDisplay({
          fileName: file.name,
          fileSize: file.size,
          pageCount: result.pageCount,
          textPreview: createTextPreview(result.text),
        });
        onExtracted(baseDoc);
      } else if (result.status === "low-text") {
        setState("low-text");
        setDisplay({
          fileName: file.name,
          fileSize: file.size,
          pageCount: result.pageCount,
          errorMessage: result.errorMessage,
        });
        onExtracted(baseDoc);
      } else {
        setState("error");
        setDisplay({
          fileName: file.name,
          fileSize: file.size,
          errorMessage: result.errorMessage,
        });
        onExtracted(baseDoc);
      }
    },
    [maxSizeMB, onExtracted]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 backdrop-blur-sm animate-slide-up">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-200">Upload Study Material</h3>
        <Badge color="cyan">PDF · Max {maxSizeMB} MB</Badge>
      </div>

      {/* Drop Zone / States */}
      <div
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-8 text-center transition-all ${
          isDragging
            ? "border-violet-400/60 bg-violet-500/10"
            : state === "idle"
              ? "border-midnight-600 hover:border-violet-500/40"
              : "border-midnight-700"
        } ${state === "processing" ? "pointer-events-none" : ""} ${
          state !== "idle" && state !== "processing" ? "cursor-default" : ""
        }`}
        onClick={() => state === "idle" && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* IDLE */}
        {state === "idle" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-200">
              Drop a PDF here or click to browse
            </p>
            <p className="text-xs text-slate-500">
              Text will be extracted page by page for your learning library
            </p>
          </>
        )}

        {/* PROCESSING */}
        {state === "processing" && display && (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-violet-300" />
            <p className="text-sm font-medium text-slate-200">
              Extracting text from {display.fileName}
            </p>
            {display.progress && (
              <p className="text-xs text-slate-400">
                Processing page {display.progress.currentPage} of {display.progress.totalPages}
                {" — "}
                {Math.round((display.progress.currentPage / display.progress.totalPages) * 100)}%
              </p>
            )}
            <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-midnight-700/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                style={{
                  width: display.progress
                    ? `${(display.progress.currentPage / display.progress.totalPages) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </>
        )}

        {/* SUCCESS */}
        {state === "success" && display && (
          <div className="w-full px-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-cyan-200">{display.fileName}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{formatFileSize(display.fileSize)}</span>
                {display.pageCount && <span>{display.pageCount} pages</span>}
              </div>
            </div>
            {display.textPreview && (
              <div className="mt-4 rounded-xl border border-midnight-700/40 bg-midnight-900/40 p-3 text-left">
                <p className="mb-1 text-xs font-medium text-slate-500">Extracted text preview:</p>
                <p className="max-h-24 overflow-y-auto text-xs leading-relaxed text-slate-400">
                  {display.textPreview}
                </p>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="mt-4 text-sm text-violet-300 hover:text-violet-200 underline underline-offset-4"
            >
              Upload another file
            </button>
          </div>
        )}

        {/* LOW-TEXT */}
        {state === "low-text" && display && (
          <div className="w-full px-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gold-200">{display.fileName}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{formatFileSize(display.fileSize)}</span>
                {display.pageCount && <span>{display.pageCount} pages</span>}
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-gold-500/20 bg-gold-500/5 p-3 text-left">
              <p className="text-xs leading-relaxed text-gold-200/80">
                {display.errorMessage}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="mt-4 text-sm text-violet-300 hover:text-violet-200 underline underline-offset-4"
            >
              Try a different file
            </button>
          </div>
        )}

        {/* ERROR */}
        {state === "error" && display && (
          <div className="w-full px-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-rose-200">{display.fileName}</p>
              <p className="max-w-sm text-xs text-rose-300/80">{display.errorMessage}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="mt-4 text-sm text-violet-300 hover:text-violet-200 underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
