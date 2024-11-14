import { ChangeEvent, FC, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import TextInput, { TextInputProps } from "../common/text-input";
import { Label } from "@/components/ui/label";
import Select, { SelectProps } from "../common/select";

export interface LinkFormValue {
  url: string;
  text: string;
  title: string;
  target: string;
  rel: string;
  class: string;
}

export interface LinkFormProps {
  className?: string;
  value?: Partial<LinkFormValue>;
  onChange?(value: LinkFormValue): void;
  controlProps?: {
    url?: TextInputProps;
    text?: TextInputProps;
    title?: TextInputProps;
    target?: SelectProps;
    rel?: TextInputProps;
    class?: TextInputProps;
  };
}

const LinkForm: FC<LinkFormProps> = (props) => {
  const { controlProps = {}, className, value, onChange } = props;

  const [currentValue, setCurrentValue] = useState({
    url: value?.url ?? "",
    text: value?.text ?? "",
    title: value?.title ?? "",
    target: value?.target ?? "_blank",
    rel: value?.rel ?? "",
    class: value?.class ?? "",
  });

  useEffect(() => {
    if (
      value?.url !== currentValue.url ||
      value?.text !== currentValue.text ||
      value?.title !== currentValue.title ||
      value?.target !== currentValue.target ||
      value?.rel !== currentValue.rel ||
      value?.class !== currentValue.class
    ) {
      setCurrentValue({
        url: value?.url ?? "",
        text: value?.text ?? "",
        title: value?.title ?? "",
        target: value?.target ?? "_blank",
        rel: value?.rel ?? "",
        class: value?.class ?? "",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (field: keyof LinkFormValue) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = {
      ...currentValue,
      [field]: e.target.value,
    };
    setCurrentValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div className={cn("flex-grow overflow-auto p-4 grid gap-4", className)}>
      <TextInput
        {...controlProps.url}
        value={currentValue.url}
        onChange={handleChange("url")}
        name={controlProps.url?.name ?? "url"}
        label={controlProps.url?.label ?? "URL"}
        labelPosition={controlProps.url?.labelPosition ?? "left"}
        labelAlign={controlProps.url?.labelAlign ?? "right"}
        size={controlProps.url?.size ?? "sm"}
      />
      <TextInput
        {...controlProps.text}
        value={currentValue.text}
        onChange={handleChange("text")}
        name={controlProps.text?.name ?? "text"}
        label={controlProps.text?.label ?? "Text"}
        labelPosition={controlProps.text?.labelPosition ?? "left"}
        labelAlign={controlProps.text?.labelAlign ?? "right"}
        size={controlProps.text?.size ?? "sm"}
      />
      <TextInput
        {...controlProps.title}
        value={currentValue.title}
        onChange={handleChange("title")}
        name={controlProps.title?.name ?? "title"}
        label={controlProps.title?.label ?? "Title"}
        labelPosition={controlProps.title?.labelPosition ?? "left"}
        labelAlign={controlProps.title?.labelAlign ?? "right"}
        size={controlProps.title?.size ?? "sm"}
      />
      <div className="flex gap-2">
       <div className="w-[25%] min-w-[25%]">
         <Label className="block text-right text-xs">Setting</Label>
       </div>
       <div className="flex-grow grid grid-cols-3 gap-2">
         <Select
           options={[
             { value: "_blank", label: "Blank" },
             { value: "_self", label: "Self" },
             { value: "_parent", label: "Parent" },
             { value: "_top", label: "Top" }
           ]}
           value={currentValue.target}
           onValueChange={(value) => handleChange("target")({ target: { value } } as ChangeEvent<HTMLInputElement>)}
           label="Target"
           size="sm"
         />
         <TextInput
           size="sm"
           label="Rel"
           placeholder="e.g. nofollow"
           value={currentValue.rel}
           onChange={handleChange("rel")}
         />
         <TextInput
           size="sm"
           label="Class"
           placeholder="e.g. external-link"
           value={currentValue.class}
           onChange={handleChange("class")}
         />
       </div>
     </div>
    </div>
  );
};

LinkForm.displayName = "@blogcode/editor/LinkForm";
export default LinkForm;
