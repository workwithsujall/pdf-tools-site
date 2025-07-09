import 'react';

declare module 'react' {
  // Fix for useState<T> type issues
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  
  // Fix for useRef<T> type issues
  export function useRef<T>(initialValue: T): { current: T };
  
  // Fix for forwardRef type issues
  export function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
} 