// Global type definitions to fix TypeScript errors

// Fix React children issues
declare global {
  namespace React {
    // Fix ReactNode vs ReactElement compatibility issues
    export type ReactNode = 
      | ReactElement<any, any>
      | ReactFragment
      | ReactPortal
      | string
      | number
      | boolean
      | null
      | undefined;

    // Fix ReactPortal children issue
    export interface ReactPortal {
      children?: ReactNode;
      key: Key | null;
      type: any;
      props: any;
    }
  }
}

// Fix JSX elements
declare namespace JSX {
  interface IntrinsicElements {
    // Add any HTML elements that might be missing
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    // Add any other elements as needed
    [elemName: string]: any;
  }
}

// This empty export is necessary to make this a module
export {}; 