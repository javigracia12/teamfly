import Link from "next/link";
import {
  LayoutGrid,
  Calendar,
  Users,
  CheckSquare,
  Briefcase,
  ArrowLeftRight,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

type SidebarProps = {
  projectId?: string;
  projectName?: string;
};

export function Sidebar({ projectId, projectName }: SidebarProps = {}) {
  const base = projectId ? `/project/${projectId}` : "";

  return (
    <aside className="w-56 shrink-0 border-r border-border-subtle bg-surface-elevated/80 flex flex-col">
      <div className="p-5 border-b border-border-subtle">
        <Link
          href={projectId ? base : "/projects"}
          className="text-xl font-semibold tracking-tight text-[rgb(var(--text))]"
        >
          Teamfly
        </Link>
        {projectName && (
          <p className="mt-1 text-sm text-[rgb(var(--text-tertiary))] truncate" title={projectName}>
            {projectName}
          </p>
        )}
      </div>
      <nav className="p-3 flex-1 space-y-0.5">
        {projectId ? (
          <>
            <Link
              href={base}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted hover:text-[rgb(var(--text))] transition-colors"
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              Dashboard
            </Link>
            <Link
              href={`${base}?tab=meetings`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted hover:text-[rgb(var(--text))] transition-colors"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              Meetings
            </Link>
            <Link
              href={`${base}?tab=team`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted hover:text-[rgb(var(--text))] transition-colors"
            >
              <Users className="w-4 h-4 shrink-0" />
              Team
            </Link>
            <Link
              href={`${base}?tab=tasks`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted hover:text-[rgb(var(--text))] transition-colors"
            >
              <CheckSquare className="w-4 h-4 shrink-0" />
              Tasks
            </Link>
            <Link
              href={`${base}?tab=clients`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted hover:text-[rgb(var(--text))] transition-colors"
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              Clients
            </Link>
          </>
        ) : (
          <Link
            href="/projects"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted hover:text-[rgb(var(--text))] transition-colors"
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            Projects
          </Link>
        )}
      </nav>
      <div className="p-3 border-t border-border-subtle space-y-2">
        <div className="px-1">
          <p className="text-xs font-medium text-[rgb(var(--text-tertiary))] mb-1.5">Theme</p>
          <ThemeToggle />
        </div>
        {projectId && (
          <Link
            href="/projects"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[rgb(var(--text-tertiary))] hover:bg-surface-muted hover:text-[rgb(var(--text))] transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4 shrink-0" />
            Switch project
          </Link>
        )}
      </div>
    </aside>
  );
}
