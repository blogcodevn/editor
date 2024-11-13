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
import { MotionProps } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RoundedSize } from "../../types";
import { getControlTextSize } from "./utils";
import ControlWrapper, { ControlWrapperProps } from "./control-wrapper";
import InputWrapper from "./input-wrapper";

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size">;
type BaseWrapperProps = Omit<ControlWrapperProps, keyof BaseInputProps>;

export interface TextInputProps extends BaseWrapperProps, BaseInputProps {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  rounded?: RoundedSize
  itemsProps?: {
    wrapper?: MotionProps & HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>;
  }
}

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
    <ControlWrapper
      label={label}
      required={required}
      className={className}
      size={size}
      labelPosition={labelPosition}
      labelWidth={labelWidth}
      labelAlign={labelAlign}
      error={error}
      helperText={helperText}
      hideAsterisk={hideAsterisk}
    >
      <InputWrapper
        leftSection={leftSection}
        rightSection={rightSection}
        rounded={rounded}
        size={size}
        itemsProps={itemsProps}
      >
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
            getControlTextSize(size),
            leftSection ? "pl-0" : "pl-2",
            rightSection ? "pr-0" : "pr-2",
          )}
        />
      </InputWrapper>
    </ControlWrapper>
  );
}

const TextInput = forwardRef(ForwardTextInput);
TextInput.displayName = "@blogcode/editor/TextInput";
export default TextInput;
