import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import DropZone from '../components/DropZone';
import ToolButtons from '../components/ToolButtons';
import FilePreview from '../components/FilePreview';
import { compressPDF } from '../services/pdfService';
import { ArrowRight, Check, Shield, Zap } from 'lucide-react';

const Home = () => {
  const [uploadedFile, setUploadedFile] = useState(null as File | null);
  const [selectedTool, setSelectedTool] = useState('compress'); // Default to compress
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFileUrl, setProcessedFileUrl] = useState(undefined as string | undefined);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState(2); // Medium compression by default
  const [processedFileName, setProcessedFileName] = useState<string | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState<number | undefined>(undefined);
  const [compressedSize, setCompressedSize] = useState<number | undefined>(undefined);

  const handleFilesDrop = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setProcessedFileUrl(undefined);
      setProcessedBlob(null);
      setError(null);
      setProcessedFileName(undefined);

      // Automatically process the file when uploaded
      handleFileProcess(files[0], selectedTool);
    }
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    setProcessedFileUrl(undefined);
    setProcessedBlob(null);
    setError(null);

    // Process if a file is uploaded
    if (uploadedFile) {
      handleFileProcess(uploadedFile, tool);
    }
  };

  const handleCompressionLevelChange = (level: number) => {
    setCompressionLevel(level);

    // Reprocess the file if one is already uploaded
    if (uploadedFile && selectedTool === 'compress') {
      handleFileProcess(uploadedFile, 'compress');
    }
  };

  const handleFileProcess = async (file: File, toolType: string) => {
    setIsProcessing(true);
    setError(null);
    setProcessedBlob(null);
    setProcessedFileUrl(undefined);
    setProcessedFileName(undefined);
    setUploadProgress(0);
    setCompressedSize(undefined);

    // Store original file size
    setOriginalSize(file.size);

    try {
      let url: string;

      // Process based on selected tool
      if (toolType === 'compress') {
        // Use real compression API with selected compression level and progress tracking
        url = await compressPDF(
          file,
          compressionLevel
        );
        if (url) {
          // Get the blob from the URL
          const response = await fetch(url);
          const blob = await response.blob();
          setProcessedBlob(blob);
          // Store compressed size
          setCompressedSize(blob.size);

          // Generate processed filename
          const originalName = file.name.replace(/\.pdf$/i, '');
          const newFileName = `${originalName}_compressed.pdf`;
          setProcessedFileName(newFileName);
          console.log(`File compressed successfully with level ${compressionLevel}`);
        }
      } else {
        // For other tools, use simulation for now
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
        setProcessedFileUrl("processed-file.pdf");
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
        <title>PDF Tools - Edit, Convert, Compress PDF Files Online</title>
        <meta name="description" content="Free online PDF tools to merge, compress, and convert PDF files" />
      </Head>

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50/40 to-white py-16 lg:py-24">
          <div className="container-content">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                All Your PDF Tools <span className="text-primary">In One Place</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Easy-to-use PDF tools to merge, compress, and convert your PDF files.
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

              {/* Tool Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8"
              >
                <ToolButtons
                  onToolSelect={handleToolSelect}
                  selectedTool={selectedTool}
                />
              </motion.div>

              {/* Compression Level Selector (only shown when compress tool is selected) */}
              {selectedTool === 'compress' && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-2">Compression Level:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        { level: 1, label: 'Light' },
                        { level: 2, label: 'Medium' },
                        { level: 3, label: 'High' },
                        { level: 4, label: 'Maximum' }
                      ].map(({ level, label }) => (
                        <button
                          key={level}
                          onClick={() => handleCompressionLevelChange(level)}
                          className={`
                            px-3 py-1 rounded-full text-sm font-medium transition-all
                            ${compressionLevel === level
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
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
              tool={selectedTool}
              errorMessage={error}
              processedFileName={processedFileName}
              compressionLevel={compressionLevel}
              uploadProgress={uploadProgress}
              originalSize={originalSize}
              compressedSize={compressedSize}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-content">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our PDF Tools</h2>
              <p className="text-gray-600">
                Powerful features designed for both professionals and everyday users
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                className="bg-white p-8 rounded-xl shadow-sm"
                whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
                <p className="text-gray-600">
                  Intuitive interface designed for quick and simple PDF modifications without technical knowledge required.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="bg-white p-8 rounded-xl shadow-sm"
                whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">100% Secure</h3>
                <p className="text-gray-600">
                  Files are processed locally on our servers and automatically deleted after processing, ensuring your privacy.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="bg-white p-8 rounded-xl shadow-sm"
                whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">High Quality</h3>
                <p className="text-gray-600">
                  Maintain document integrity while optimizing for smaller file sizes and better performance.
                </p>
              </motion.div>
            </div>

            <div className="mt-16 text-center">
              <a
                href="#tools"
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Explore all our PDF tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                PDF Tools
              </h3>
              <p className="text-gray-400 text-sm">
                Professional PDF tools for all your document needs. Simple, secure, and free to use.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compress PDF</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Merge PDF</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Split PDF</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Convert PDF</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} PDF Tools. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 