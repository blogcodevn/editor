import { MediaFactoryConfig, MediaGroupComponent } from "./types";
import BaseMediaGroup from "./group";

export default function createMediaGroup(config: MediaFactoryConfig): MediaGroupComponent {
  const MediaGroup: MediaGroupComponent = (props) => (
    <BaseMediaGroup
      {...props}
      onUploadImage={config.onUploadImage}
      internalDomains={config.internalDomains}
    />
  );

  MediaGroup.displayName = BaseMediaGroup.displayName;
  return MediaGroup;
}
