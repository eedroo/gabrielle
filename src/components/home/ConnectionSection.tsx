import { home } from "@/content/home";
import { VideoStatement } from "@/components/shared/VideoStatement";

export function ConnectionSection() {
  return <VideoStatement {...home.connection} />;
}
