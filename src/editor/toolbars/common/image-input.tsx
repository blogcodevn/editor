/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, ForwardedRef, forwardRef, MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Info, Upload } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { isAllowedUrl } from "./utils";
import TextInput, { TextInputProps } from "./text-input";
import Button from "./button";

export interface UploadResult {
  url?: string;
}

export interface ImageInputProps extends Omit<TextInputProps, "type"> {
  onInvalidURL?(value: string): void;
  onUpload?(form: FormData): Promise<UploadResult>;
  preview?: boolean;
  previewSize?: "sm" | "md" | "lg";
  allowedDomains?: string[];
  infoTitle?: ReactNode;
}

function ForwardImageInput(props: ImageInputProps, ref: ForwardedRef<HTMLInputElement>) {
  const {
    rightSection,
    name,
    value = "",
    preview = true,
    previewSize = "md",
    allowedDomains,
    infoTitle,
    label,
    onChange,
    onInvalidURL,
    onUpload,
    ...rest
  } = props;

  const [ currentValue, setCurrentValue ] = useState(value);
  const [ isPopoverOpen, setIsPopoverOpen ] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    value === currentValue || setCurrentValue(value);
  }, [value]);

  const handleClickChooseFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fileRef.current?.click();
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.value;

    setCurrentValue(image);
    onChange?.(e);

    if (!isAllowedUrl(image, allowedDomains)) {
      onInvalidURL?.(image);
    }
  };

  const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files?.length) {
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    if (onUpload && typeof onUpload === "function") {
      try {
        const result = await onUpload(formData);

        if (result.url) {
          setCurrentValue(result.url);
          handleChangeInput({
            name,
            target: {
              name,
              value: result.url,
            },
            currentTarget: {
              name,
              value: result.url,
            }
          } as unknown as ChangeEvent<HTMLInputElement>);
        }
      } catch {}
    }

    e.target.value = "";
  };

  const rightContent = (
    <>
      {rightSection}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            className="-ml-3 mr-[-13px] h-8 mt-[-1px] rounded-l-none"
            onClick={handleClickChooseFile}
          >
            <Upload size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            "bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-white backdrop-blur-sm",
            "border border-gray-200 dark:border-gray-600"
          )}
        >
          <p className="text-xs">
            Upload an image from your device
          </p>
        </TooltipContent>
      </Tooltip>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={handleChangeFile}
      />
    </>
  );

  const inputLabel = (
    <>
      {label}
      {(allowedDomains && allowedDomains.length > 0) || !!infoTitle && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info size={16} className="text-gray-400 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold mb-1">{infoTitle || "Allowed Domains"}</p>
            {allowedDomains?.length === 0 || (
              <ul className="list-disc pl-4">
                {allowedDomains?.map((domain, index) => (
                  <li key={index}>{domain}</li>
                ))}
              </ul>
            )}
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );

  const previewSizeClass = {
    sm: "max-w-[100px] max-h-[100px]",
    md: "max-w-[200px] max-h-[200px]",
    lg: "max-w-[300px] max-h-[300px]",
  }[previewSize];

  return (
    <Popover open={isPopoverOpen && preview} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div 
          className="w-full"
          onMouseEnter={() => currentValue && setIsPopoverOpen(true)}
          onMouseLeave={() => setIsPopoverOpen(false)}
        >
          <TextInput
            {...rest}
            ref={ref}
            type="text"
            name={name}
            label={inputLabel}
            rightSection={rightContent}
            value={currentValue}
            onChange={handleChangeInput}
          />
        </div>
      </PopoverTrigger>
      {preview && !!currentValue && (
        <PopoverContent
          className={cn(
            "backdrop-blur-md bg-opacity-10 bg-white/50 dark:bg-gray-800/50 border-gray-300",
            "border dark:border-gray-700 dark:shadow-slate-200/10 p-2"
          )}
          onMouseEnter={() => setIsPopoverOpen(true)}
          onMouseLeave={() => setIsPopoverOpen(false)}
        >
          <AnimatePresence>
            <motion.img
              src={currentValue as string}
              alt="Uploaded image"
              className={cn("object-contain text-xs", previewSizeClass)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
        </PopoverContent>
      )}
    </Popover>
  );
}

const ImageInput = forwardRef(ForwardImageInput);
ImageInput.displayName = "@blogcode/editor/ImageInput";
export default ImageInput;
