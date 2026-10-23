import { PdfUploader } from "@/components/pdf/PdfUploader";
import { useLibraryStore } from "@/store/libraryStore";
import type { LibraryItem } from "@/types";

/**
 * Dashboard upload panel — wraps the reusable PdfUploader and
 * saves extracted documents to the shared library store.
 */
export function UploadPanel() {
  const { addDocument } = useLibraryStore();

  const handleExtracted = (doc: LibraryItem) => {
    addDocument(doc);
  };

  return <PdfUploader onExtracted={handleExtracted} />;
}
