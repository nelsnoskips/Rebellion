import type { Metadata } from "next";
import { EditorialHome } from "@/components/home/EditorialHome";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Kept as an alias of `/` so the link already sent to the client still opens
 * the site they chose. Delete once nobody is holding that URL.
 */
export default function RebellionAPage() {
  return <EditorialHome />;
}
