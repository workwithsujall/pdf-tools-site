import * as React from "react"

import cn from "@/lib/utils"

// Define strongly typed interfaces
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...otherProps}
      />
    );
  }
)
  // Set display name using type assertion
  ; (Card as any).displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...otherProps}
      />
    );
  }
)
  ; (CardHeader as any).displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;
    return (
      <h3
        ref={ref}
        className={cn(
          "text-2xl font-semibold leading-none tracking-tight",
          className
        )}
        {...otherProps}
      />
    );
  }
)
  ; (CardTitle as any).displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...otherProps}
      />
    );
  }
)
  ; (CardDescription as any).displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;
    return (
      <div ref={ref} className={cn("p-6 pt-0", className)} {...otherProps} />
    );
  }
)
  ; (CardContent as any).displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...otherProps}
      />
    );
  }
)
  ; (CardFooter as any).displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } 