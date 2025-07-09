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

// Define Card as a regular function component
const CardComponent = (props: CardProps, ref: any) => {
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
};

// Wrap with forwardRef and type assertion
const Card = React.forwardRef(CardComponent as any) as any;
Card.displayName = "Card";

// Define CardHeader as a regular function component
const CardHeaderComponent = (props: CardHeaderProps, ref: any) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...otherProps}
    />
  );
};

// Wrap with forwardRef and type assertion
const CardHeader = React.forwardRef(CardHeaderComponent as any) as any;
CardHeader.displayName = "CardHeader";

// Define CardTitle as a regular function component
const CardTitleComponent = (props: CardTitleProps, ref: any) => {
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
};

// Wrap with forwardRef and type assertion
const CardTitle = React.forwardRef(CardTitleComponent as any) as any;
CardTitle.displayName = "CardTitle";

// Define CardDescription as a regular function component
const CardDescriptionComponent = (props: CardDescriptionProps, ref: any) => {
  const { className, ...otherProps } = props;
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...otherProps}
    />
  );
};

// Wrap with forwardRef and type assertion
const CardDescription = React.forwardRef(CardDescriptionComponent as any) as any;
CardDescription.displayName = "CardDescription";

// Define CardContent as a regular function component
const CardContentComponent = (props: CardContentProps, ref: any) => {
  const { className, ...otherProps } = props;
  return (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...otherProps} />
  );
};

// Wrap with forwardRef and type assertion
const CardContent = React.forwardRef(CardContentComponent as any) as any;
CardContent.displayName = "CardContent";

// Define CardFooter as a regular function component
const CardFooterComponent = (props: CardFooterProps, ref: any) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...otherProps}
    />
  );
};

// Wrap with forwardRef and type assertion
const CardFooter = React.forwardRef(CardFooterComponent as any) as any;
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } 