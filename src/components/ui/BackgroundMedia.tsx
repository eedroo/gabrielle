import type { ImageContent } from "@/content/home";
import type { VideoSource } from "@/lib/images";
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
export function BackgroundMedia({ image, video, priority, className = "absolute inset-0 -z-20" }: Props) {
  return (
    <div className={className}>
      <EditorialImage image={image} priority={priority} className="absolute inset-0" />
      {video && <BackgroundVideo video={video} className="absolute inset-0" />}
    </div>
  );
}
