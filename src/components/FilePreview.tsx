import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { Modal } from './ui/modal';
import { compressPDF, downloadBlob } from '../services/pdfService';

interface FilePreviewProps {
  file: File | null;
  processedFileUrl?: string;
  processedBlob?: Blob | null;
  isProcessing: boolean;
  tool: string;
  errorMessage?: string | null;
  processedFileName?: string;
  compressionLevel?: number;
  uploadProgress?: number;
  originalSize?: number;
  compressedSize?: number;
}

const FilePreview = ({
  file,
  processedFileUrl,
  processedBlob,
  isProcessing,
  tool,
  errorMessage,
  processedFileName,
  compressionLevel = 2,
  uploadProgress = 0,
  originalSize,
  compressedSize
}: FilePreviewProps) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  // Fix TypeScript error by using type assertion instead of generic type parameters
  const [modalType, setModalType] = useState('success' as 'success' | 'error');
  const [localErrorMessage, setLocalErrorMessage] = useState('' as string);

  // Handle error from parent component
  useEffect(() => {
    if (errorMessage) {
      setModalType('error');
      setLocalErrorMessage(errorMessage);
      setShowModal(true);
    }
  }, [errorMessage]);

  // Use provided upload progress or simulate progress
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isProcessing) {
      // If we have real upload progress, use it
      if (uploadProgress > 0) {
        setInternalProgress(uploadProgress);
      } else {
        // Otherwise simulate progress
        // Reset progress
        setInternalProgress(0);
        // Simulate progress
        interval = setInterval(() => {
          setInternalProgress((prev: number) => {
            const next = prev + Math.random() * 10;
            return next > 95 ? 95 : next;
          });
        }, 500);
      }
    } else if (internalProgress > 0) {
      // Complete progress
      setInternalProgress(100);
      // If we have a processed file, show success modal after progress completes
      if (processedFileUrl || processedBlob) {
        setTimeout(() => {
          setModalType('success');
          setShowModal(true);
        }, 500);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, processedFileUrl, processedBlob, uploadProgress, internalProgress]);

  if (!file && !processedFileUrl && !processedBlob && !isProcessing) {
    return null;
  }

  const getToolActionName = (tool: string) => {
    switch (tool) {
      case 'merge':
        return 'Merged';
      case 'compress':
        return 'Compressed';
      case 'convert':
        return 'Converted';
      default:
        return 'Processed';
    }
  };

  const handleDownload = () => {
    if (processedBlob) {
      // Use the provided filename if available, otherwise generate one
      const fileName = processedFileName ||
        `${file?.name.replace('.pdf', '')}_${tool}ed.pdf`;

      // Use our blob directly with the service
      downloadBlob(processedBlob, fileName);
    } else if (processedFileUrl) {
      // Legacy support for the simulated URL
      window.open(processedFileUrl, '_blank');
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={`file-preview-${isProcessing ? 'processing' : 'done'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-3xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>
                {(processedFileUrl || processedBlob) ? `${getToolActionName(tool)} PDF` : 'File Preview'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {file && (
                  <motion.div
                    className="flex items-center justify-between p-4 border rounded-md bg-muted/20"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-md bg-primary/10 p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isProcessing && (
                  <div className="space-y-4 py-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Processing file...</span>
                      <span className="text-sm font-medium">{Math.round(internalProgress)}%</span>
                    </div>
                    <Progress value={internalProgress} className="h-2" />

                    <div className="pt-6 space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <div className="flex space-x-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-32" />
                      </div>
                    </div>
                  </div>
                )}

                {(processedFileUrl || processedBlob) && !isProcessing && (
                  <motion.div
                    className="border rounded-md p-6 flex flex-col items-center space-y-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-green-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p className="font-medium">File processed successfully!</p>
                    <p className="text-sm text-muted-foreground text-center">
                      Your {tool === 'compress' ? 'compressed' : tool === 'convert' ? 'converted' : 'merged'} PDF file is ready to download
                    </p>
                    {processedFileName && (
                      <p className="text-sm font-medium text-center">
                        {processedFileName}
                      </p>
                    )}
                    {/* Show compression info */}
                    {tool === 'compress' && originalSize && compressedSize && (
                      <div className="text-sm text-center space-y-1">
                        <div className="flex justify-center space-x-8">
                          <div>
                            <p className="text-gray-500">Original</p>
                            <p className="font-medium">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Compressed</p>
                            <p className="font-medium">{(compressedSize / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <p className="text-green-600 font-medium">
                          {Math.round((1 - compressedSize / originalSize) * 100)}% reduced
                        </p>
                      </div>
                    )}
                    {tool === 'compress' && compressionLevel && (
                      <div className="mt-2 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        {compressionLevel === 1 && 'Light compression'}
                        {compressionLevel === 2 && 'Medium compression'}
                        {compressionLevel === 3 && 'High compression'}
                        {compressionLevel === 4 && 'Maximum compression'}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {(processedFileUrl || processedBlob) && (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button onClick={handleDownload}>
                    Download PDF
                  </Button>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Success Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'success' ? "Success!" : "Error"}
        type={modalType}
        message={modalType === 'success'
          ? `Your PDF has been ${tool === 'compress' ? 'compressed' : tool === 'convert' ? 'converted' : 'merged'} successfully.`
          : localErrorMessage || errorMessage || "Something went wrong while processing your file."
        }
      >
        {modalType === 'success' && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowModal(false)}
              className="mt-2"
            >
              Close
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default FilePreview; 