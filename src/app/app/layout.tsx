import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Shell } from "@/components/layout/shell";
import { getSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return <Shell>{children}</Shell>;
}
