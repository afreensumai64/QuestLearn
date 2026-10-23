import { BookOpen, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/states";
import { PdfUploader } from "@/components/pdf/PdfUploader";
import { DocumentCard } from "@/components/pdf/DocumentCard";
import { useLibraryStore, getExtractedText } from "@/store/libraryStore";
import type { LibraryItem } from "@/types";

export function LibraryPage() {
  const { documents, addDocument, removeDocument } = useLibraryStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleExtracted = (doc: LibraryItem) => {
    addDocument(doc);
  };

  const handleRemove = (id: string) => {
    removeDocument(id);
  };

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const readyCount = documents.filter((d) => d.status === "ready").length;

  // Access extracted text for the learning engine (available but not yet wired)
  const _extractedText = getExtractedText(documents);
  void _extractedText;

  return (
    <div>
      <PageHeader
        title="Knowledge Library"
        subtitle="Upload study materials and discover topics to learn."
        icon={<BookOpen className="h-6 w-6" />}
      />

      {/* Upload Zone */}
      <div className="mb-6">
        <PdfUploader onExtracted={handleExtracted} />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your library..."
          className="w-full rounded-xl border border-midnight-700/50 bg-midnight-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500/40 focus:shadow-glow"
        />
      </div>

      {/* Library Items */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-200">Your Materials</h3>
        <div className="flex items-center gap-2">
          <Badge color="slate">{documents.length} total</Badge>
          {readyCount > 0 && <Badge color="gold">{readyCount} ready</Badge>}
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <div className="rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 backdrop-blur-sm">
          {documents.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title="Your library is empty"
              message="Upload a PDF file above to extract its text and build your personal collection of learning materials."
            />
          ) : (
            <EmptyState
              icon={<Search className="h-12 w-12" />}
              title="No results found"
              message={`No documents match "${searchQuery}". Try a different search term.`}
            />
          )}
        </div>
      ) : (
        <div className="space-y-2 animate-fade-in">
          {filteredDocs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
