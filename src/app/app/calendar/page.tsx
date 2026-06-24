import { listCalendarEvents } from "@/services";
import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/layout/shell";
import { CalendarBoard } from "./board";

export default async function CalendarPage() {
  const session = await requireSession();
  const events = await listCalendarEvents(session.userId);
  return (
    <div>
      <PageHeader
        badge="SCHEDULE · EDITORIAL"
        title="Calendário Editorial"
        subtitle="Vídeos, shorts, lives e séries. Visualize mensalmente."
      />
      <CalendarBoard events={events} />
    </div>
  );
}
