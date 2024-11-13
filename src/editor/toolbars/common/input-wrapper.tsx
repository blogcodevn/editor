import { HTMLAttributes, PropsWithChildren, ReactNode, RefAttributes } from "react";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { ControlSize, RoundedSize } from "../../types";
import { roundedes, sizes } from "./utils";
import { cn } from "@/lib/utils";

export interface InputWrapperProps {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  rounded?: RoundedSize;
  size?: ControlSize;
  itemsProps?: {
    wrapper?: MotionProps & HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>;
  }
}

const sectionVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
}

function InputWrapper(props: PropsWithChildren<InputWrapperProps>) {
  const {
    leftSection,
    rightSection,
    rounded,
    size,
    itemsProps = {},
    children
  } = props;

  return (
    <motion.div
        {...itemsProps.wrapper}
        ref={itemsProps.wrapper?.ref}
        className={cn(
          "w-full flex items-center border border-input border-gray-300 dark:border-gray-600 bg-white",
          "dark:bg-slate-700 bg-opacity-20 overflow-hidden",
          size ? sizes[size] : sizes.default,
          rounded ? roundedes[rounded] : roundedes.md,
          itemsProps.wrapper?.className,
        )}
        initial={itemsProps.wrapper?.initial || { opacity: 0, scale: 0.95 }}
        animate={itemsProps.wrapper?.animate || { opacity: 1, scale: 1 }}
        transition={itemsProps.wrapper?.transition || { duration: 0.3, ease: "easeOut" }}
      >
        {!!leftSection && (
          <AnimatePresence>
            <motion.div 
              className="h-full flex items-center justify-center px-3"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {leftSection}
            </motion.div>
          </AnimatePresence>
        )}
        {children}
        <AnimatePresence>
          {!!rightSection && (
            <motion.div 
              className="h-full flex items-center justify-center px-3"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {rightSection}
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  );
}

InputWrapper.displayName = "@blogcode/editor/InputWrapper";
export default InputWrapper;
