import { getTexts } from "@/lib/texts";
import { ClosingCTA } from "@/components/shared/ClosingCTA";

export async function BookingCTA() {
  const home = await getTexts("home");
  return <ClosingCTA content={home.booking} />;
}
