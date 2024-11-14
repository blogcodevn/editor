import { MediaFactoryConfig, MediaGroupComponent } from "./types";
import Image from "./image";
import BaseMediaGroup from "./group";
import Link from "./link";

export default function mediaFactory(config: MediaFactoryConfig) {
  const ImageExtension = Image.configure({
    HTMLAttributes: {
      class: 'media-image'
    },
    internalDomains: config.internalDomains,
    onUploadImage: config.onUploadImage
  });

  const LinkExtension = Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  });

  const MediaGroup: MediaGroupComponent = (props) => (
    <BaseMediaGroup
      {...props}
      onUploadImage={config.onUploadImage}
      internalDomains={config.internalDomains}
    />
  );

  MediaGroup.displayName = BaseMediaGroup.displayName;
  return { MediaGroup, MediaExtensions: [LinkExtension, ImageExtension] };
}
