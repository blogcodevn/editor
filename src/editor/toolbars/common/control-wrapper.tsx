import { ComponentPropsWithoutRef, PropsWithChildren, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { ControlSize } from "../../types";
import { cn } from "@/lib/utils";
import { getControlTextSize } from "./utils";

export type LabelProps = ComponentPropsWithoutRef<typeof Label>;

export interface ControlWrapperProps extends LabelProps {
  label?: ReactNode;
  required?: boolean;
  hideAsterisk?: boolean;
  size?: ControlSize;
  labelPosition?: "top" | "left";
  labelWidth?: string | number;
  labelAlign?: "left" | "center" | "right";
  error?: string;
  helperText?: string;
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
}

const errorVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
}

function ControlWrapper(props: PropsWithChildren<ControlWrapperProps>) {
  const {
    label,
    required,
    className,
    size = "default",
    labelPosition = "top",
    labelWidth = "25%",
    labelAlign = "left",
    hideAsterisk,
    error,
    helperText,
    children,
    ...rest
  } = props;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn("w-full mt-auto", className)}
    >
      <div className={cn("w-full", labelPosition === "left" ? "flex items-center gap-2" : "",)}>
        {!!label && (
          <motion.div
            variants={variants}
            style={labelPosition === "left" ? { width: labelWidth, minWidth: labelWidth } : {}}
          >
            <Label
              {...rest}
              className={cn(
                "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1",
                {
                  "text-left": labelAlign === "left",
                  "text-center": labelAlign === "center",
                  "text-right": labelAlign === "right",
                },
                {
                  "text-xs": size === "sm",
                  "text-lg": size === "lg",
                }
              )}
            >
              {label}
              {required && !hideAsterisk && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </motion.div>
        )}
        {children}
      </div>
      <AnimatePresence>
        {!!error && (
          <div className={cn("w-full", labelPosition === "left" ? "flex items-center gap-2" : "")}>
            {labelPosition === "left" && (
              <div style={{ width: labelWidth, minWidth: labelWidth }} />
            )}
            <motion.p 
              className={cn(
                "mt-1 text-sm text-red-500",
                getControlTextSize(size),
              )}
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {error}
            </motion.p>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!!helperText && (
          <div className={cn("w-full", labelPosition === "left" ? "flex items-center gap-2" : "")}>
            {labelPosition === "left" && (
              <div style={{ width: labelWidth, minWidth: labelWidth }} />
            )}
            <motion.p 
              className={cn(
                "mt-1 text-sm text-gray-500",
                getControlTextSize(size),
              )}
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {helperText}
            </motion.p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

ControlWrapper.displayName = "@blogcode/editor/ControlWrapper";
export default ControlWrapper;
