import { AnimatePresence, motion } from 'framer-motion';

// Augment React JSX namespace with motion elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'motion.div': any;
      'motion.button': any;
      'motion.a': any;
      'motion.span': any;
      'motion.p': any;
      'motion.svg': any;
      'motion.path': any;
      'motion.circle': any;
    }
  }
}

// Augment framer-motion types
declare module 'framer-motion' {
  export interface AnimatePresenceProps {
    mode?: 'sync' | 'wait' | 'popLayout';
  }
} 