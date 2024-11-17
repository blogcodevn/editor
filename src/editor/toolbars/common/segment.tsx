import {
  ChangeEvent,
  forwardRef,
  Fragment,
  InputHTMLAttributes,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { cn } from "@/lib/utils";

export interface SegmentOption {
  value: string | number;
  label?: ReactNode;
}

export type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onClick" | "onMouseDown">;

export interface SegmentProps extends BaseInputProps {
  onMouseDown?(e: MouseEvent<HTMLButtonElement>): void;
  onClick?(e: MouseEvent<HTMLButtonElement>): void;
  options: SegmentOption[];
  separator?: boolean;
}

const Segment = forwardRef<HTMLInputElement, SegmentProps>(
  function Segment(props, ref) {
    const { options, className, separator, value, name, onClick, onChange, onMouseDown, ...rest } = props;

    const currentOptions = useMemo(() => options, [options]);

    const [currentValue, setCurrentValue] = useState((() => {
      const selected = options.find((option) => option.value === value);
      return selected?.value ?? options[0]?.value;
    }));

    const wrapper = useRef<HTMLDivElement>(null);
    const indicator = useRef<HTMLDivElement>(null);

    const updateIndicator = useCallback(() => {
      if (!wrapper.current || !indicator.current) {
        return;
      }

      const selected = currentOptions.findIndex((option) => option.value === currentValue);

      if (selected === -1) {
        indicator.current.style.width = "0px";
        indicator.current.style.left = "0px";
        return;
      }

      const children = Array.from(wrapper.current.children).filter((child) => child.tagName === "BUTTON");
      const button = children[selected] as HTMLButtonElement;

      if (!button) {
        indicator.current.style.width = "0px";
        indicator.current.style.left = "0px";
        return;
      }

      const wrapperRect = wrapper.current.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      indicator.current.style.width = `${buttonRect.width}px`;
      indicator.current.style.left = `${buttonRect.left - wrapperRect.left}px`;
    }, [wrapper, indicator, currentValue, currentOptions]);

    useEffect(() => {
      const selected = currentOptions.find((option) => option.value === value);

      if (selected) {
        setCurrentValue(selected.value);
        return;
      }

      const next = currentOptions[0]?.value;
      const target = { name, value: next };
      setCurrentValue(next);

      onChange?.({
        target:{...target},
        currentTarget: {...target},
      } as unknown as ChangeEvent<HTMLInputElement>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
      const selected = options.find((option) => option.value === currentValue);

      if (!selected) {
        const value = options[0]?.value;
        const target = { name, value };
        setCurrentValue(value);
        onChange?.({
          target: {...target},
          currentTarget: {...target},
        } as unknown as ChangeEvent<HTMLInputElement>);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    useEffect(() => {
      currentValue && updateIndicator();
    }, [currentValue, updateIndicator]);

    useEffect(() => {
      if (!currentValue || typeof window === "undefined") {
        return;
      }

      requestAnimationFrame(updateIndicator);
      window.addEventListener("resize", updateIndicator);
      window.addEventListener("scroll", updateIndicator);

      return () => {
        window.removeEventListener("resize", updateIndicator);
        window.removeEventListener("scroll", updateIndicator);
      };
    }, [updateIndicator, currentValue]);

    useLayoutEffect(() => {
      if (!currentValue) {
        return;
      }

      updateIndicator();
    }, [currentOptions, currentValue, updateIndicator, separator]);

    const handleClick = (option: SegmentOption) => (e: MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);

      const value = option.value;
      const target = { name, value };

      setCurrentValue(value);
      onChange?.({
        target: {...target},
        currentTarget: {...target},
      } as unknown as ChangeEvent<HTMLInputElement>);
    };

    return (
      <div
        ref={wrapper}
        className={cn("inline-flex justify-start max-w-full flex-wrap relative p-1 rounded bg-slate-800", className)}
      >
        <div ref={indicator} className="absolute top-1 bottom-1 bg-slate-400/40 backdrop-blur-md rounded transition-all" />
        {options.map((option, index) => (
          <Fragment key={option.value}>
            <button
              type="button"
              className={cn("relative inline-flex items-center px-2 py-1 rounded-md min-w-max max-w-max text-sm gap-1")}
              onClick={handleClick(option)}
              onMouseDown={onMouseDown}
            >
              {option.label}
            </button>
            {index < options.length - 1 && separator && (
              <div className="inline-flex items-center justify-center text-xs text-slate-500 mx-1">|</div>
            )}
          </Fragment>
        ))}
        <input {...rest} ref={ref} type="hidden" />
      </div>
    );
  }
);

Segment.displayName = "@blogcode/editor/Segment";
export default Segment;
