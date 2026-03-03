import Link from "next/link";
import type { Meeting, Associate, ClientFile } from "@prisma/client";

type AssociateWithCount = Associate & {
  _count: { tasks: number; feedback: number };
};

type TaskSummary = {
  id: string;
  title: string;
  status: string;
  associate: { id: string; name: string };
};

type Props = {
  projectId: string;
  projectName: string;
  associates: AssociateWithCount[];
  openTasks: TaskSummary[];
  upcomingMeetings: Meeting[];
  clientFiles: ClientFile[];
};

function formatMeetingDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProjectDashboard({
  projectId,
  projectName,
  associates,
  openTasks,
  upcomingMeetings,
  clientFiles,
}: Props) {
  const openCount = openTasks.length;

  return (
    <div className="space-y-10">
      {/* Team at a glance */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Team at a glance</h2>
          <Link
            href={`/project/${projectId}?tab=team`}
            className="text-sm font-medium text-[rgb(var(--accent))] hover:underline"
          >
            View team →
          </Link>
        </div>
        {associates.length === 0 ? (
          <p className="text-[rgb(var(--text-tertiary))] py-4 rounded-xl border border-border-subtle bg-surface-elevated px-4">
            No one on the team yet. Add associates in the Team tab.
          </p>
        ) : (
          <ul className="space-y-2">
            {associates.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/project/${projectId}/associate/${a.id}`}
                  className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 hover:border-border hover:shadow-soft transition-all"
                >
                  <div>
                    <p className="font-medium text-[rgb(var(--text))]">{a.name}</p>
                    <p className="text-sm text-[rgb(var(--text-tertiary))] mt-0.5">
                      {a.role ?? "—"} · {a._count.tasks} task{a._count.tasks !== 1 ? "s" : ""}
                      {a._count.feedback > 0 && ` · ${a._count.feedback} feedback`}
                    </p>
                  </div>
                  <span className="text-[rgb(var(--text-tertiary))]">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Open tasks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Open tasks</h2>
          <Link
            href={`/project/${projectId}?tab=tasks`}
            className="text-sm font-medium text-[rgb(var(--accent))] hover:underline"
          >
            View all tasks →
          </Link>
        </div>
        {openCount === 0 ? (
          <p className="text-[rgb(var(--text-tertiary))] py-4 rounded-xl border border-border-subtle bg-surface-elevated px-4">
            No open tasks. Everything done or add tasks from a team member’s page.
          </p>
        ) : (
          <ul className="space-y-2">
            {openTasks.slice(0, 8).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/project/${projectId}/associate/${t.associate.id}`}
                    className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 hover:border-border transition-all"
                  >
                    <span className="font-medium text-[rgb(var(--text))]">{t.title}</span>
                    <span className="text-sm text-[rgb(var(--text-tertiary))]">
                      {t.associate.name}
                    </span>
                  </Link>
                </li>
              ))}
            {openCount > 8 && (
              <li>
                <Link
                  href={`/project/${projectId}?tab=tasks`}
                  className="block text-center py-2 text-sm text-[rgb(var(--accent))] hover:underline"
                >
                  +{openCount - 8} more
                </Link>
              </li>
            )}
          </ul>
        )}
      </section>

      {/* Upcoming meetings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Upcoming meetings</h2>
          <Link
            href={`/project/${projectId}?tab=meetings`}
            className="text-sm font-medium text-[rgb(var(--accent))] hover:underline"
          >
            View all →
          </Link>
        </div>
        {upcomingMeetings.length === 0 ? (
          <p className="text-[rgb(var(--text-tertiary))] py-4 rounded-xl border border-border-subtle bg-surface-elevated px-4">
            No meetings scheduled. Add key meetings in the Meetings tab.
          </p>
        ) : (
          <ul className="space-y-2">
            {upcomingMeetings.slice(0, 4).map((m) => (
              <li key={m.id}>
                <Link
                  href={`/project/${projectId}?tab=meetings`}
                  className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 hover:border-border transition-all"
                >
                  <div>
                    <p className="font-medium text-[rgb(var(--text))]">{m.title}</p>
                    <p className="text-sm text-[rgb(var(--text-tertiary))] mt-0.5">
                      {formatMeetingDate(m.scheduledAt)}
                    </p>
                  </div>
                  <span className="text-[rgb(var(--text-tertiary))]">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Clients */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Clients</h2>
          <Link
            href={`/project/${projectId}?tab=clients`}
            className="text-sm font-medium text-[rgb(var(--accent))] hover:underline"
          >
            View all →
          </Link>
        </div>
        {clientFiles.length === 0 ? (
          <p className="text-[rgb(var(--text-tertiary))] py-4 rounded-xl border border-border-subtle bg-surface-elevated px-4">
            No client files. Add clients in the Clients tab.
          </p>
        ) : (
          <ul className="space-y-2">
            {clientFiles.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/project/${projectId}/client/${c.id}`}
                  className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 hover:border-border transition-all"
                >
                  <div>
                    <p className="font-medium text-[rgb(var(--text))]">{c.clientName}</p>
                    <p className="text-sm text-[rgb(var(--text-tertiary))] mt-0.5">
                      {c.role ?? "—"}
                    </p>
                  </div>
                  <span className="text-[rgb(var(--text-tertiary))]">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
