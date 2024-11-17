import { FC, useCallback, useMemo } from "react";
import { CommonGroupProps, PropsWithEditor } from "@blogcode/editor/types";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";
import Picker, { PickerType } from "./picker";
import Group from "@blogcode/editor/toolbars/common/group";
import IconColor from "@/editor/icons/icon-color";
import IconBackground from "@/editor/icons/icon-background";
import "./colors.css";

export interface ColorsGroupIcons {
  textStyle?: SvgIcon;
  highlight?: SvgIcon;
};

export type ColorsGroupProps = CommonGroupProps<PickerType, ColorsGroupIcons>;

const ColorsGroup: FC<PropsWithEditor<ColorsGroupProps>> = (props) => {
  const { className, exclude = [], editor, btnClassName, icons = {} } = props;

  const items = useMemo(() => [
    {
      type: "textStyle",
      Icon: icons.textStyle || IconColor,
    },
    {
      type: "highlight",
      Icon: icons.highlight || IconBackground,
    }
  ] as const, [icons]);

  const isIncluded = useCallback((type: PickerType) => !exclude.includes(type), [exclude]);

  const renderButton = useCallback(
    (item: typeof items[number]) => {
      if (!isIncluded(item.type)) {
        return null;
      }

      return (
        <Picker
          key={item.type}
          type={item.type}
          Icon={item.Icon}
          editor={editor}
          className={btnClassName}
        />
      );
    },
    [isIncluded, editor, btnClassName]
  );

  return (
    <Group className={className}>
      {items.map(renderButton)}
    </Group>
  );
};

ColorsGroup.displayName = "@blogcode/editor/ColorsGroup";
export default ColorsGroup;
