/**
 * PDF text extraction utility using PDF.js.
 *
 * Extracts text page-by-page from a PDF File in the browser.
 * Detects when a PDF has little or no extractable text (e.g. scanned
 * documents) and returns a clear status so the UI can inform the user.
 */

import * as pdfjsLib from "pdfjs-dist";
import type { ExtractionStatus } from "@/types";

// Use Vite's ?url suffix to get the worker URL as a static import
// (avoids top-level await which isn't available in all build targets)
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
  status: ExtractionStatus;
  errorMessage?: string;
}

export interface PdfExtractionProgress {
  currentPage: number;
  totalPages: number;
}

/**
 * Extract text from a PDF file, page by page.
 * Reports progress via the onProgress callback.
 *
 * @param file The PDF File to process
 * @param onProgress Called as each page is processed
 * @returns Extraction result with full text, page count, and status
 */
export async function extractPdfText(
  file: File,
  onProgress?: (progress: PdfExtractionProgress) => void
): Promise<PdfExtractionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    let fullText = "";

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .trim();

      fullText += pageText + "\n\n";
      onProgress?.({ currentPage: i, totalPages });
    }

    fullText = fullText.trim();

    // Heuristic: if the average text per page is very low, the PDF is
    // likely a scanned document that needs OCR (not included in this MVP)
    const avgTextPerPage = fullText.length / totalPages;
    const MIN_CHARS_PER_PAGE = 10;

    if (fullText.length === 0 || avgTextPerPage < MIN_CHARS_PER_PAGE) {
      return {
        text: fullText,
        pageCount: totalPages,
        status: "low-text",
        errorMessage:
          "This PDF contains little or no extractable text. It may be a scanned document that requires OCR (optical character recognition), which is not included in this MVP.",
      };
    }

    return {
      text: fullText,
      pageCount: totalPages,
      status: "ready",
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to extract text from PDF.";
    return {
      text: "",
      pageCount: 0,
      status: "error",
      errorMessage: message,
    };
  }
}

// Re-export shared formatting helpers
export { createTextPreview, formatFileSize } from "./formatters";

/**
 * Validate a file is a PDF and within the size limit.
 */
export function validatePdfFile(
  file: File,
  maxSizeMB = 25
): { valid: boolean; error?: string } {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "Only PDF files are supported." };
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File is ${sizeMB.toFixed(1)} MB. Maximum allowed size is ${maxSizeMB} MB.`,
    };
  }

  return { valid: true };
}
