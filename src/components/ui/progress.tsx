import * as React from "react"
import { motion } from "framer-motion"
import cn from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
  showValue?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (props, ref) => {
    const {
      value = 0,
      max = 100,
      className,
      indicatorClassName,
      showValue = false,
      ...otherProps
    } = props;

    const percentage = Math.min(Math.max(value, 0), max) / max * 100;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...otherProps}
      >
        <motion.div
          className={cn(
            "h-full w-full flex-1 bg-primary transition-all",
            indicatorClassName
          )}
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {showValue && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary-foreground">
              {Math.round(percentage)}%
            </div>
          )}
        </motion.div>
      </div>
    )
  }
)

  ; (Progress as any).displayName = "Progress"

export { Progress } 