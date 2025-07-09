import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import MultiFileDropZone from '../components/MultiFileDropZone';
import FilePreview from '../components/FilePreview';
import { mergePDFs } from '../services/pdfService';
import { Button } from '../components/ui/button';
import { ArrowUpDown, FileCheck, MoveRight } from 'lucide-react';

const MergePage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | undefined>(undefined);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState<string | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFilesDrop = (files: File[]): void => {
    if (files.length === 0) return;

    // Filter out any non-PDF files
    const pdfFiles = files.filter(file =>
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
      setError('Only PDF files are supported');
      return;
    }

    // Add files to the existing list without duplicates
    setUploadedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      pdfFiles.forEach(file => {
        // Check if file already exists in the array by comparing name and size
        const exists = prevFiles.some(f => f.name === file.name && f.size === file.size);
        if (!exists) {
          newFiles.push(file);
        }
      });
      return newFiles;
    });

    // Reset processing state
    setProcessedFileUrl(undefined);
    setProcessedBlob(null);
    setError(null);
    setProcessedFileName(undefined);
  };

  const handleRemoveFile = (file: File): void => {
    setUploadedFiles(prevFiles =>
      prevFiles.filter(f => !(f.name === file.name && f.size === file.size))
    );
  };

  const handleMergeFiles = async (): Promise<void> => {
    if (uploadedFiles.length < 2) {
      setError('Please add at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessedBlob(null);
    setProcessedFileUrl(undefined);
    setProcessedFileName(undefined);
    setUploadProgress(0);

    try {
      // Call the merge API
      const url = await mergePDFs(uploadedFiles);

      if (url) {
        // Get the blob from the URL
        const response = await fetch(url);
        const blob = await response.blob();

        setProcessedBlob(blob);
        setProcessedFileUrl(url);

        // Create a descriptive filename
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
        setProcessedFileName(`merged_document_${timestamp}.pdf`);
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Merge PDF Files - PDF Tools</title>
        <meta name="description" content="Merge multiple PDF files into a single document" />
      </Head>

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50/40 to-white py-16">
          <div className="container-content">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                Merge <span className="text-primary">PDF Files</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Combine multiple PDF documents into a single file in seconds.
                No installation needed, 100% secure.
              </p>

              {/* Multi-file Dropzone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <MultiFileDropZone
                  onFilesDrop={handleFilesDrop}
                  isUploading={isProcessing}
                  maxFiles={10}
                  files={uploadedFiles}
                  onRemoveFile={handleRemoveFile}
                />
              </motion.div>

              {/* Merge Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8"
              >
                <Button
                  className="px-8 py-6 text-lg h-auto"
                  onClick={handleMergeFiles}
                  disabled={isProcessing || uploadedFiles.length < 2}
                >
                  <ArrowUpDown className="mr-2 h-5 w-5" />
                  {isProcessing ? 'Merging...' : `Merge ${uploadedFiles.length > 0 ? uploadedFiles.length : ''} PDFs`}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* File Preview Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <FilePreview
              file={uploadedFiles.length > 0 ? uploadedFiles[0] : null}
              processedFileUrl={processedFileUrl}
              processedBlob={processedBlob}
              isProcessing={isProcessing}
              tool="merge"
              errorMessage={error}
              processedFileName={processedFileName}
              uploadProgress={uploadProgress}
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container-content">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600">
                Three easy steps to merge your PDF files
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div
                className="bg-white p-8 rounded-xl shadow-sm relative"
                whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Files</h3>
                <p className="text-gray-600">
                  Select or drag and drop the PDF files you want to merge
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-8 rounded-xl shadow-sm relative"
                whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <MoveRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Arrange Order</h3>
                <p className="text-gray-600">
                  Organize your PDFs in the desired order for the final document
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-8 rounded-xl shadow-sm relative"
                whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Download</h3>
                <p className="text-gray-600">
                  Process and download your merged PDF file
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container-content">
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} PDF Tools. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MergePage; 