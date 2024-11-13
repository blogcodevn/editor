import { FC, useCallback, useMemo } from "react";
import { Droplet, Palette } from "lucide-react";
import { CommonGroupProps, EditorIcon, PropsWithEditor } from "../../types";
import Picker, { PickerType } from "./picker";
import Group from "../common/group";
import "./colors.css";

export interface ColorsGroupIcons {
  textStyle?: EditorIcon;
  highlight?: EditorIcon;
};

export type ColorsGroupProps = CommonGroupProps<PickerType, ColorsGroupIcons>;

const ColorsGroup: FC<PropsWithEditor<ColorsGroupProps>> = (props) => {
  const { className, exclude = [], editor, btnClassName, icons = {} } = props;

  const items = useMemo(() => [
    {
      type: "textStyle",
      Icon: icons.textStyle || Palette,
    },
    {
      type: "highlight",
      Icon: icons.highlight || Droplet,
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
