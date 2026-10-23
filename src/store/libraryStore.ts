import { create } from "zustand";
import type { LibraryItem } from "@/types";

interface LibraryStore {
  documents: LibraryItem[];
  addDocument: (doc: LibraryItem) => void;
  updateDocument: (id: string, updates: Partial<LibraryItem>) => void;
  removeDocument: (id: string) => void;
}

import { createTextPreview } from "@/utils/formatters";

const SAMPLE_TEXT_1 =
  "Binary search trees are binary trees where each node has a key greater than all keys in its left subtree and less than all keys in its right subtree. Self-balancing trees like AVL and Red-Black guarantee O(log n) operations.";

const SAMPLE_TEXT_2 =
  "Deep learning networks adjust their internal synaptic weights through backwards propagation of loss errors computed with matrix partial derivatives.";

export const useLibraryStore = create<LibraryStore>((set) => ({
  documents: [
    {
      id: "doc-sample-1",
      title: "Data_Structures_and_Algorithms_Tome.pdf",
      type: "pdf",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      content: SAMPLE_TEXT_1,
      status: "ready",
      fileSize: 2450000,
      pageCount: 16,
      textPreview: createTextPreview(SAMPLE_TEXT_1),
    },
    {
      id: "doc-sample-2",
      title: "Neural_Architectures_Primer.pdf",
      type: "pdf",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      content: SAMPLE_TEXT_2,
      status: "ready",
      fileSize: 4120000,
      pageCount: 28,
      textPreview: createTextPreview(SAMPLE_TEXT_2),
    },
  ],
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
