import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  RefAttributes,
  useEffect,
  useState
} from "react";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sizes = {
  default: "h-10 text-sm",
  sm: "h-8 text-xs",
  lg: "h-12 text-lg",
};

const roundedes = {
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

export interface TextInputProps extends BaseInputProps {
  error?: string;
  helperText?: string;
  label?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  hideAsterisk?: boolean;
  size?: keyof typeof sizes;
  rounded?: keyof typeof roundedes;
  labelPosition?: "top" | "left";
  labelWidth?: string | number;
  labelAlign?: "left" | "center" | "right";
  itemsProps?: {
    wrapper?: MotionProps & HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>;
  }
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

const sectionVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
}

const getTextSize = (size: keyof typeof sizes) => {
  return {
    "text-xs": size === "sm",
    "text-lg": size === "lg",
    "text-sm": size === "default",
  };
};

function ForwardTextInput(props: TextInputProps, ref: ForwardedRef<HTMLInputElement>) {
  const {
    label,
    required,
    className,
    autoComplete = "off",
    type = "text",
    size = "default",
    rounded = "md",
    labelPosition = "top",
    labelWidth = "25%",
    labelAlign = "left",
    id,
    error,
    helperText,
    value = "",
    leftSection,
    rightSection,
    hideAsterisk,
    onChange,
    itemsProps = {},
    ...rest
  } = props;

  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    value === currentValue || setCurrentValue(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
    onChange?.(e);
  };

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
            style={{ width: labelWidth, minWidth: labelWidth }}
          >
            <Label
              htmlFor={id}
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
          <Input
            {...rest}
            ref={ref}
            id={id}
            type={type}
            required={required}
            autoComplete={autoComplete}
            value={currentValue}
            onChange={handleChange}
            className={cn(
              "text-gray-900 dark:text-white h-full bg-transparent border-none mt-0 w-full px-0",
              "!ring-0 !ring-offset-0",
              getTextSize(size),
              leftSection ? "pl-0" : "pl-2",
              rightSection ? "pr-0" : "pr-2",
            )}
          />
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
                getTextSize(size),
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
                getTextSize(size),
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

const TextInput = forwardRef(ForwardTextInput);
TextInput.displayName = "@blogcode/editor/TextInput";
export default TextInput;
