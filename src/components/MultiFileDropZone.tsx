import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FileIcon, UploadCloud, X } from 'lucide-react';
import { Button } from './ui/button';

interface MultiFileDropZoneProps {
  onFilesDrop: (files: File[]) => void;
  isUploading?: boolean;
  maxFiles?: number;
  files: File[];
  onRemoveFile: (file: File) => void;
}

const MultiFileDropZone: React.FC<MultiFileDropZoneProps> = ({ 
  onFilesDrop, 
  isUploading = false, 
  maxFiles = 10,
  files,
  onRemoveFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [remainingCapacity, setRemainingCapacity] = useState(maxFiles);

  // Update remaining capacity when files or maxFiles change
  useEffect(() => {
    setRemainingCapacity(maxFiles - files.length);
  }, [files.length, maxFiles]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only allow PDF files
    const pdfFiles = acceptedFiles.filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    // Only take up to the remaining capacity
    const filesToAdd = pdfFiles.slice(0, remainingCapacity);
    if (filesToAdd.length > 0) {
      onFilesDrop(filesToAdd);
    }
  }, [onFilesDrop, remainingCapacity]);

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
    disabled: isUploading || remainingCapacity <= 0,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    noClick: remainingCapacity <= 0
  });

  // Determine border and background color based on drag state
  const getStyles = () => {
    if (isUploading) return 'border-gray-300 bg-gray-50/50 cursor-not-allowed';
    if (remainingCapacity <= 0) return 'border-gray-300 bg-gray-50/50 cursor-not-allowed';
    if (isDragReject) return 'border-red-500 bg-red-50/50';
    if (isDragAccept) return 'border-green-500 bg-green-50/50';
    if (isDragActive) return 'border-primary-400 bg-primary-50/50';
    return 'border-gray-200 hover:border-primary-300 bg-white/80';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full space-y-4">
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
            py-8 px-6 sm:px-8 transition-all duration-200 ease-in-out
            ${getStyles()}
          `}
          aria-label="Drop zone for PDF files"
        >
          <input {...getInputProps()} />
          <motion.div 
            className="flex flex-col items-center justify-center space-y-3"
            animate={isDragActive && !isUploading ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className={`
                rounded-full p-4
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
                    className="h-8 w-8 text-primary/60" 
                  />
                </motion.div>
              ) : (
                <UploadCloud className="h-8 w-8 text-primary" />
              )}
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: isUploading ? 0.7 : 1 }}
            >
              {remainingCapacity <= 0 ? (
                <h3 className="text-lg font-medium text-amber-600">
                  Maximum number of files reached
                </h3>
              ) : (
                <h3 className="text-lg font-medium">
                  {isDragActive ? 'Drop your PDF files here' : 'Drop PDF files here'}
                </h3>
              )}
              
              {remainingCapacity > 0 && (
                <p className="text-gray-500 text-sm mt-1">
                  {isDragActive ? 'Release to upload' : 'or click to browse files'}
                </p>
              )}
              
              <p className="text-sm font-medium mt-2">
                {files.length > 0 ? (
                  <span className={remainingCapacity <= 0 ? 'text-amber-600' : 'text-primary'}>
                    {files.length} of {maxFiles} files added
                  </span>
                ) : (
                  <span className="text-primary">Add up to {maxFiles} PDF files</span>
                )}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {files.length > 0 && (
        <motion.div 
          className="bg-white rounded-xl p-4 max-w-3xl mx-auto shadow-sm border"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <h4 className="font-medium text-gray-700 mb-3">Files to merge ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <motion.div 
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <FileIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium truncate text-sm max-w-[200px] sm:max-w-md">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(file);
                  }}
                  disabled={isUploading}
                  className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MultiFileDropZone; 