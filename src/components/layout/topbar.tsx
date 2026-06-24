import { getSession } from "@/lib/session";
import { getUserById } from "@/services";
import { LogoutButton } from "./logout-button";
import { MobileMenu } from "./mobile-menu";
import { SearchTrigger } from "./search-trigger";
import { Logo } from "@/components/brand/logo";
import Link from "next/link";

export async function Topbar() {
  const session = await getSession();
  const user = session ? await getUserById(session.userId) : null;

  return (
    <header className="sticky top-0 z-30 cl-glass border-b border-border/60">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <MobileMenu />
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>

        <div className="flex-1 max-w-xl">
          <SearchTrigger />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {user && (
            <>
              <Link
                href="/app/profile"
                className="hidden sm:flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full hover:bg-surface/70 transition-colors border border-transparent hover:border-border-2"
              >
                <div className="relative h-7 w-7 rounded-full cl-gradient-brand flex items-center justify-center text-white text-[10px] font-semibold cl-glow-soft">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="leading-tight">
                  <div className="text-[12px] font-medium text-fg">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-muted">
                    {user.role === "admin" ? "Administrator" : "Member"}
                  </div>
                </div>
              </Link>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
