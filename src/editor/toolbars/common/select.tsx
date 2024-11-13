import { ComponentPropsWithoutRef, ReactNode, useEffect, useMemo, useState } from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import ControlWrapper, { ControlWrapperProps } from "./control-wrapper";
import InputWrapper, { InputWrapperProps } from "./input-wrapper";
import { cn } from "@/lib/utils";
import { getControlTextSize } from "./utils";

export interface SelectOption {
  value: string | number;
  label: ReactNode;
}

type BaseSelectProps = ComponentPropsWithoutRef<typeof ShadcnSelect>;
type BaseWrapperProps = Omit<ControlWrapperProps, keyof BaseSelectProps>;

export interface SelectProps extends BaseWrapperProps, InputWrapperProps, BaseSelectProps {
  options?: SelectOption[];
  placeholder?: string;
}

function Select(props: SelectProps) {
  const {
    label,
    required,
    className,
    size = "default",
    labelPosition,
    labelWidth,
    labelAlign,
    error,
    helperText,
    hideAsterisk,
    leftSection,
    rightSection,
    rounded,
    itemsProps = {},
    options = [],
    value = "",
    placeholder,
    onValueChange,
    ...rest
  } = props;

  const [ currentValue, setCurrentValue ] = useState(value);
  const currentOptions = useMemo(() => options, [options]);
  
  useEffect(() => {
    value === currentValue || setCurrentValue(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleValueChange = (value: string) => {
    setCurrentValue(value);
    onValueChange?.(value);
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
        <ShadcnSelect
          {...rest}
          value={currentValue}
          onValueChange={handleValueChange}
        >
          <SelectTrigger
            className={cn(
              "text-gray-900 dark:text-white h-full !bg-transparent border-none mt-0 w-full px-0",
              "!ring-0 !ring-offset-0",
              getControlTextSize(size),
              leftSection ? "pl-0" : "pl-2",
              rightSection ? "pr-0" : "pr-2",
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {currentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadcnSelect>
      </InputWrapper>
    </ControlWrapper>
  );
}

Select.displayName = "@blogcode/editor/Select";
export default Select;
