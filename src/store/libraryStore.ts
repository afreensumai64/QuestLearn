import { create } from "zustand";
import type { LibraryItem } from "@/types";

interface LibraryStore {
  documents: LibraryItem[];
  addDocument: (doc: LibraryItem) => void;
  updateDocument: (id: string, updates: Partial<LibraryItem>) => void;
  removeDocument: (id: string) => void;
}

export const useLibraryStore = create<LibraryStore>((set) => ({
  documents: [],
  addDocument: (doc) =>
    set((state) => ({ documents: [doc, ...state.documents] })),
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
}));

/**
 * Returns all extracted text from uploaded, successfully processed documents.
 * This is the interface the learning engine will use to access uploaded content.
 */
export function getExtractedText(documents: LibraryItem[]): string {
  return documents
    .filter((doc) => doc.status === "ready" && doc.content.length > 0)
    .map((doc) => doc.content)
    .join("\n\n---\n\n");
}
