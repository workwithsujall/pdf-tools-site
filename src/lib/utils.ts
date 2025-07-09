import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Define ClassValue type directly to avoid namespace issues
type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean | undefined } | ClassValue[];

/**
 * Utility function to merge class names with clsx and tailwind-merge
 * Used for combining Tailwind CSS classes conditionally without style conflicts
 */
export default function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
} 