import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import DropZone from '../components/DropZone';
import FilePreview from '../components/FilePreview';
import { splitPDF } from '../services/pdfService';
import { Button } from '../components/ui/button';
import { Layers, Scissors, FileCheck } from 'lucide-react';

const SplitPage: React.FC = () => {
    const [uploadedFile, setUploadedFile] = useState(null as File | null);
    const [isProcessing, setIsProcessing] = useState(false as boolean);
    const [processedFileUrl, setProcessedFileUrl] = useState(undefined as string | undefined);
    const [processedBlob, setProcessedBlob] = useState(null as Blob | null);
    const [error, setError] = useState(null as string | null);
    const [processedFileName, setProcessedFileName] = useState(undefined as string | undefined);
    const [uploadProgress, setUploadProgress] = useState(0 as number);
    const [splitMode, setSplitMode] = useState('all' as 'all' | 'range');
    const [pageRange, setPageRange] = useState('' as string);

    const handleFilesDrop = (files: File[]): void => {
        if (files.length === 0) return;

        // Just take the first PDF file
        const pdfFiles = files.filter(file =>
            file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );

        if (pdfFiles.length === 0) {
            setError('Only PDF files are supported');
            return;
        }

        // Use the first PDF file
        setUploadedFile(pdfFiles[0]);

        // Reset processing state
        setProcessedFileUrl(undefined);
        setProcessedBlob(null);
        setError(null);
        setProcessedFileName(undefined);
    };

    const handleSplitFile = async (): Promise<void> => {
        if (!uploadedFile) {
            setError('Please upload a PDF file to split');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setProcessedBlob(null);
        setProcessedFileUrl(undefined);
        setProcessedFileName(undefined);
        setUploadProgress(0);

        try {
            // Call the split API
            const url = await splitPDF(
                uploadedFile,
                splitMode === 'range' ? pageRange : undefined,
                splitMode === 'all'
            );

            if (url) {
                // Get the blob from the URL
                const response = await fetch(url);
                const blob = await response.blob();

                setProcessedBlob(blob);
                setProcessedFileUrl(url);

                // Create a descriptive filename
                const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
                setProcessedFileName(`${uploadedFile.name.replace('.pdf', '')}_split_${timestamp}.zip`);
            }
        } catch (err) {
            console.error('Processing error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePageRangeChange = (e: any): void => {
        setPageRange(e.target.value);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Split PDF Files - PDF Tools</title>
                <meta name="description" content="Split a PDF into individual pages or custom ranges" />
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
                                Split <span className="text-primary">PDF Files</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                                Split your PDF into individual pages or extract specific page ranges.
                                No installation needed, 100% secure.
                            </p>

                            {/* Dropzone */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <DropZone
                                    onFilesDrop={handleFilesDrop}
                                    isUploading={isProcessing}
                                />
                            </motion.div>

                            {/* Split Options */}
                            {uploadedFile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="mt-8"
                                >
                                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                                        <h2 className="text-xl font-semibold mb-4">Split Options</h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-4">
                                                <input
                                                    type="radio"
                                                    id="split-all"
                                                    name="split-mode"
                                                    checked={splitMode === 'all'}
                                                    onChange={() => setSplitMode('all')}
                                                    className="h-4 w-4 text-primary"
                                                />
                                                <label htmlFor="split-all" className="text-gray-700">
                                                    Split into individual pages
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <input
                                                    type="radio"
                                                    id="split-range"
                                                    name="split-mode"
                                                    checked={splitMode === 'range'}
                                                    onChange={() => setSplitMode('range')}
                                                    className="h-4 w-4 text-primary"
                                                />
                                                <label htmlFor="split-range" className="text-gray-700">
                                                    Extract specific pages
                                                </label>
                                            </div>

                                            {splitMode === 'range' && (
                                                <div className="pl-8">
                                                    <input
                                                        type="text"
                                                        value={pageRange}
                                                        onChange={handlePageRangeChange}
                                                        placeholder="e.g., 1,3,5-9,12"
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                    />
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Format: 1,3,5-9,12 (comma-separated page numbers and ranges)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        className="px-8 py-6 text-lg h-auto"
                                        onClick={handleSplitFile}
                                        disabled={isProcessing || !uploadedFile}
                                    >
                                        <Scissors className="mr-2 h-5 w-5" />
                                        {isProcessing ? 'Processing...' : 'Split PDF'}
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* File Preview Section */}
                <section className="py-12 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <FilePreview
                            file={uploadedFile}
                            processedFileUrl={processedFileUrl}
                            processedBlob={processedBlob}
                            isProcessing={isProcessing}
                            tool="split"
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
                                Three easy steps to split your PDF files
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
                                <h3 className="text-xl font-bold mb-2">Upload PDF</h3>
                                <p className="text-gray-600">
                                    Select or drag and drop the PDF file you want to split
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
                                    <Scissors className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Choose Split Options</h3>
                                <p className="text-gray-600">
                                    Select to split into all pages or specify page ranges
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
                                    Process and download your split PDF files in a ZIP archive
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

export default SplitPage; 