import { ControlSize } from "../../types";

export const getControlTextSize = (size: ControlSize) => {
  return {
    "!text-xs": size === "sm",
    "!text-lg": size === "lg",
    "!text-sm": size === "default",
  };
};

export const sizes = {
  default: "h-10 text-sm",
  sm: "h-8 text-xs",
  lg: "h-12 text-lg",
};

export const roundedes = {
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};
