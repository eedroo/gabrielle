import type { ImageContent } from "@/content/home";
import type { VideoSource } from "@/lib/images";
import { getMediaOverrides } from "@/lib/media-slots";
import { BackgroundVideo } from "./BackgroundVideo";
import { EditorialImage } from "./EditorialImage";

type Props = {
  image: ImageContent;
  video?: VideoSource | null;
  priority?: boolean;
  className?: string;
};

/**
 * Full-bleed background: the photo (also the video's cover while it loads)
 * with the looping video on top when one exists in /public/videos.
 */
export async function BackgroundMedia({ image, video: fileVideo, priority, className = "absolute inset-0 -z-20" }: Props) {
  // A video uploaded in the backoffice for this slot replaces the file in /public/videos.
  const override = image.slot ? (await getMediaOverrides()).get(image.slot) : undefined;
  const video: VideoSource | null | undefined = override?.video_url
    ? { src: override.video_url, mobileSrc: override.video_mobile_url }
    : fileVideo;
  return (
    <div className={className}>
      <EditorialImage image={image} priority={priority} className="absolute inset-0" />
      {video && <BackgroundVideo video={video} className="absolute inset-0" />}
    </div>
  );
}
