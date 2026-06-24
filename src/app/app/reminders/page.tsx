import { requireSession } from "@/lib/session";
import { listReminders, listProjects } from "@/services/calvoleiro";
import { PageHeader } from "@/components/layout/shell";
import { RemindersBoard } from "./board";

export default async function RemindersPage() {
  const session = await requireSession();
  const [reminders, projects] = await Promise.all([
    listReminders(session.userId),
    listProjects(session.userId),
  ]);
  return (
    <div>
      <PageHeader
        badge="WORKSPACE · REMINDERS"
        title="Lembretes"
        subtitle="O que você não pode esquecer."
      />
      <RemindersBoard reminders={reminders} projects={projects} />
    </div>
  );
}
