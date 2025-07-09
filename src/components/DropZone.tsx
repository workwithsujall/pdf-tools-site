import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FileIcon, UploadCloud } from 'lucide-react';

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void;
  isUploading?: boolean;
}

const DropZone = ({ onFilesDrop, isUploading = false }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesDrop(acceptedFiles);
  }, [onFilesDrop]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB max file size
    maxFiles: 1, // Only allow one file at a time
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    disabled: isUploading
  });

  // Determine border and background color based on drag state
  const getStyles = () => {
    if (isUploading) return 'border-gray-300 bg-gray-50/50 cursor-not-allowed';
    if (isDragReject) return 'border-red-500 bg-red-50/50';
    if (isDragAccept) return 'border-green-500 bg-green-50/50';
    if (isDragActive) return 'border-primary-400 bg-primary-50/50';
    return 'border-gray-200 hover:border-primary-300 bg-white/80';
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        {...getRootProps()} 
        className={`
          w-full max-w-3xl mx-auto border-2 border-dashed rounded-xl 
          py-10 px-6 sm:px-10 transition-all duration-200 ease-in-out
          ${getStyles()}
        `}
        aria-label="Drop zone for PDF files"
      >
        <input {...getInputProps()} />
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4"
          animate={isDragActive && !isUploading ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className={`
              rounded-full p-5
              ${isUploading ? 'bg-gray-100' : 'bg-primary/10'}
            `}
            animate={isDragActive && !isUploading ? 
              { y: [0, -10, 0], rotate: [0, -5, 5, 0] } : {}
            }
            transition={{ 
              duration: 1, 
              repeat: isDragActive && !isUploading ? Infinity : 0,
              repeatType: "loop" 
            }}
          >
            {isUploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <FileIcon 
                  className="h-10 w-10 text-primary/60" 
                />
              </motion.div>
            ) : (
              <UploadCloud className="h-10 w-10 text-primary" />
            )}
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: isUploading ? 0.7 : 1 }}
          >
            <h3 className="text-xl font-medium">
              {isDragActive ? 'Drop your PDF here' : 'Drop your PDF file here'}
            </h3>
            <p className="text-gray-500 mt-2 mb-1">
              {isDragActive ? 'Release to upload' : 'or click to browse files'}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-500 mt-4">
              <span className="flex items-center border border-gray-200 rounded-full px-3 py-1">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M12 3L4 5V11.5C4 15.2483 7.3208 19.3684 11.96 20.82C12.3262 20.94 12.6738 20.94 13.04 20.82C17.6792 19.3684 21 15.2483 21 11.5V5L13 3H12Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                100% Secure
              </span>
              <span className="flex items-center border border-gray-200 rounded-full px-3 py-1">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 14L15 8M9 8H15V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Max 50MB
              </span>
              <span className="flex items-center border border-gray-200 rounded-full px-3 py-1">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Instant Processing
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DropZone; 