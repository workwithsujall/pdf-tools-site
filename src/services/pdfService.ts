/**
 * PDF Service for interacting with the backend API
 */

// Update import path
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function mergePDFs(files: File[]): Promise<string> {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  const res = await fetch(`${API_URL}/api/merge`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to merge PDFs');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  return url;
}

// Alternative handleMerge function matching the user's snippet
export const handleMerge = async (files: File[]): Promise<string> => {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  const res = await fetch(`${API_URL}/api/merge`, {
    method: "POST",
    body: formData
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  return url;
};

export async function splitPDF(file: File, pages?: string, splitAll?: boolean): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  if (pages) {
    formData.append("pages", pages);
  }

  if (splitAll) {
    formData.append("split_all", "true");
  }

  const res = await fetch(`${API_URL}/api/split`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to split PDF');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  return url;
}

export async function compressPDF(file: File, compressionLevel: number = 1): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("compression_level", compressionLevel.toString());

  const res = await fetch(`${API_URL}/compress-pdf`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to compress PDF');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  return url;
}

/**
 * Download a blob as a file
 * @param blob - The blob to download
 * @param filename - The filename to use
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the object URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}; 