import { requireSession } from "@/lib/session";
import { getProfile } from "@/services/calvoleiro";
import { getUserById } from "@/services";
import { PageHeader } from "@/components/layout/shell";
import { ProfileForm } from "./form";

export default async function ProfilePage() {
  const session = await requireSession();
  const [user, profile] = await Promise.all([
    getUserById(session.userId),
    getProfile(session.userId),
  ]);
  return (
    <div>
      <PageHeader
        badge="SYSTEM · PROFILE"
        title="Seu perfil"
        subtitle="Personalize sua identidade no Calvoleiro."
      />
      <ProfileForm user={user} profile={profile} />
    </div>
  );
}
