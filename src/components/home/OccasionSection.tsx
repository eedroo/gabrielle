import { getTexts } from "@/lib/texts";
import { VideoStatement } from "@/components/shared/VideoStatement";

export async function OccasionSection() {
  const home = await getTexts("home");
  return <VideoStatement {...home.occasion} />;
}
