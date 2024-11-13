import { ForwardedRef, forwardRef, PropsWithChildren, ReactNode } from "react";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ShadcnButtonProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  centered?: boolean;
  loading?: boolean | "right";
  fullWidth?: boolean;
}

const sizes = {
  default: "h-10 text-xs",
  sm: "h-8 text-xs",
  icon: "h-10 w-10",
  lg: "h-12 text-sm",
};

const buttonVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: { scale: 0.98 }
};

const MotionButton = motion.create(ShadcnButton);

function ForwardButton(props: PropsWithChildren<ButtonProps>, ref: ForwardedRef<HTMLButtonElement>) {
  const {
    children,
    leftIcon,
    rightIcon,
    className,
    size = "default",
    centered,
    loading,
    disabled,
    fullWidth = true,
    ...rest
  } = props;

  const Spinner = () => (
    <Loader2 className="h-4 w-4 animate-spin" />
  );

  const leftContent = loading === true ? <Spinner /> : leftIcon;
  const rightContent = loading === "right" ? <Spinner /> : rightIcon;

  return (
    <MotionButton
      ref={ref}
      className={cn(
        "bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-white hover:bg-white/80",
        "dark:hover:bg-gray-600/80 h-8 text-xs rounded-md backdrop-blur-sm border border-gray-200",
        "dark:border-gray-600 gap-2 font-semibold px-3 py-0 items-center",
        "transition-colors duration-200",
        fullWidth && "w-full",
        size ? sizes[size] : sizes.default,
        className
      )}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileTap="tap"
      disabled={!!loading || disabled}
      {...rest as MotionProps}
    >
      <AnimatePresence>
        {!!leftContent && (
          <motion.span 
            className="inline-flex h-full items-center justify-center px-3 -ml-3"
            key={loading === true ? 'spinner' : 'leftIcon'}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {leftContent}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span 
        className={cn("inline-flex h-full items-center justify-center", !centered && "flex-grow w-full")}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.span>
      <AnimatePresence>
        {!!rightContent && (
          <motion.span 
            key={loading === "right" ? 'spinner' : 'rightIcon'}
            className="inline-flex h-full items-center justify-center px-3 -mr-3"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {rightContent}
          </motion.span>
        )}
      </AnimatePresence>
    </MotionButton>
  );
}

const Button = forwardRef(ForwardButton);
Button.displayName = "@blogcode/editor/Button";
export default Button;
