import { ControlSize } from "../../types";

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

export const getControlTextSize = (size: ControlSize) => {
  return {
    "!text-xs": size === "sm",
    "!text-lg": size === "lg",
    "!text-sm": size === "default",
  };
};

export function normalize(url: string) {
  return url.toLowerCase().replace(/^(https?:)?(\/\/)?(www\.)?/, '').split('/')[0] + "/";
}

export function isAllowedUrl(url: string, allowedDomains?: string[]): boolean {
  if (!allowedDomains?.length) return false;

  if (!url.match(/^(\/|https?:\/\/|\/\/|blob:|data:image\/|\.\.?\/)/)) {
    return false;
  }

  const isRelative = url.startsWith("/") && !url.startsWith("//");
  const isBackForward = url.startsWith("../") || url.startsWith("./");
  const isBase64 = url.startsWith("data:image/");

  if (isRelative || isBackForward || isBase64) {
    return true;
  }

  const isProtocol = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
  const isBlob = url.startsWith("blob:");

  if (isProtocol || isBlob) {
    let domain;

    if (isBlob) {
      const blob = new URL(url);
      domain = normalize(blob.pathname);
    } else {
      domain = normalize(url);
    }

    return allowedDomains.some((allowed) => {
      const source = normalize(allowed);
      const allowedParts = source.startsWith("*.") ? source.replace("*.", '') : source;
      return domain === allowedParts;
    });
  }

  return false;
}
