import * as React from 'react';

declare module 'react' {
  // Basic React types
  type FC<P = {}> = FunctionComponent<P>;

  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement | null;
    displayName?: string;
  }

  type ReactNode =
    | ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | ReactNodeArray;

  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  type ReactNodeArray = Array<ReactNode>;

  type Key = string | number;

  type JSXElementConstructor<P> =
    | ((props: P) => ReactElement | null)
    | (new (props: P) => Component<P, any>);

  // Element attributes
  interface HTMLAttributes<T> {
    className?: string;
    style?: CSSProperties;
    [key: string]: any;
  }

  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }

  type CSSProperties = {
    [key: string]: string | number | undefined;
  };

  // Fix for useState
  function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  function useState<S = undefined>(): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>];

  // Fix for forwardRef
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
} 