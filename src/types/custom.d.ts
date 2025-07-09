// Type declarations for modules without proper type definitions
declare module 'react';
declare module 'react-dom';
declare module 'next/head';
declare module 'next/link';
declare module '@radix-ui/react-slot';
declare module '@radix-ui/react-dialog';
declare module 'class-variance-authority';
declare module 'clsx';
declare module 'lucide-react';
declare module 'react-dropzone';
declare module 'tailwind-merge';

// Define JSX namespace to fix JSX element errors
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 