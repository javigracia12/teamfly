"use client";

import Link from "next/link";
import { toggleTaskStatus } from "@/lib/actions";
import type { Task } from "@prisma/client";

type TaskWithRelations = Task & {
  associate: {
    id: string;
    name: string;
    projectId: string;
    project: { id: string; name: string };
  };
};

type Props = {
  tasks: TaskWithRelations[];
  allTasks: TaskWithRelations[];
  statusFilter: string;
  hideDone: boolean;
  view: "person" | "project" | "list";
  totalCount: number;
  doneCount: number;
  projectBaseUrl?: string;
};

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "todo", label: "To do" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" },
] as const;

const VIEW_OPTIONS = [
  { id: "person", label: "By person" },
  { id: "project", label: "By project" },
  { id: "list", label: "List" },
] as const;

function TaskRow({
  task,
  showContext,
  showAssociateOnly,
}: {
  task: TaskWithRelations;
  showContext?: boolean;
  showAssociateOnly?: boolean;
}) {
  return (
    <li
      className={`flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 ${
        task.status === "done" ? "opacity-80" : ""
      }`}
    >
      <form
        action={toggleTaskStatus.bind(
          null,
          task.associate.id,
          task.id,
          task.status === "done" ? "todo" : "done"
        )}
      >
        <button
          type="submit"
          className="flex items-center justify-center w-6 h-6 rounded-md border-2 border-border hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent)/0.08)] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:ring-offset-2"
          title={task.status === "done" ? "Mark not done" : "Mark done"}
          aria-label={task.status === "done" ? "Mark not done" : "Mark done"}
        >
          {task.status === "done" && (
            <svg
              className="w-3.5 h-3.5 text-[rgb(var(--accent))]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </form>
      <div className="flex-1 min-w-0">
        <span
          className={`font-medium ${
            task.status === "done"
              ? "line-through text-[rgb(var(--text-tertiary))]"
              : "text-[rgb(var(--text))]"
          }`}
        >
          {task.title}
        </span>
        {showContext && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-sm text-[rgb(var(--text-tertiary))]">
            <Link
              href={`/project/${task.associate.project.id}/associate/${task.associate.id}`}
              className="hover:text-[rgb(var(--accent))] transition-colors"
            >
              {task.associate.name}
            </Link>
            <span>·</span>
            <Link
              href={`/project/${task.associate.project.id}`}
              className="hover:text-[rgb(var(--accent))] transition-colors"
            >
              {task.associate.project.name}
            </Link>
          </div>
        )}
        {showAssociateOnly && (
          <div className="mt-1 text-sm text-[rgb(var(--text-tertiary))]">
            <Link
              href={`/project/${task.associate.project.id}/associate/${task.associate.id}`}
              className="hover:text-[rgb(var(--accent))] transition-colors"
            >
              {task.associate.name}
            </Link>
          </div>
        )}
      </div>
      <span
        className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
          task.status === "done"
            ? "bg-green-500/10 text-green-700 dark:text-green-400"
            : task.status === "in_progress"
            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
            : "bg-surface-muted text-[rgb(var(--text-secondary))]"
        }`}
      >
        {task.status === "done"
          ? "Done"
          : task.status === "in_progress"
          ? "In progress"
          : "To do"}
      </span>
    </li>
  );
}

export function TasksDashboard({
  tasks,
  allTasks,
  statusFilter,
  hideDone,
  view,
  totalCount,
  doneCount,
  projectBaseUrl,
}: Props) {
  const base = projectBaseUrl ?? "/tasks";
  const isProjectScope = Boolean(projectBaseUrl);

  const buildQuery = (overrides: { view?: string; status?: string; hideDone?: boolean } = {}) => {
    const v = overrides.view ?? view;
    const s = overrides.status ?? statusFilter;
    const h = overrides.hideDone ?? hideDone;
    const p = new URLSearchParams();
    if (isProjectScope) p.set("tab", "tasks");
    if (v !== "person") p.set("view", v);
    if (s !== "all") p.set("status", s);
    if (h) p.set("hideDone", "1");
    const q = p.toString();
    return q ? `${base}?${q}` : (isProjectScope ? `${base}?tab=tasks` : base);
  };

  const openCount = totalCount - doneCount;

  return (
    <div>
      {/* View switcher: how you see tasks */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm font-medium text-[rgb(var(--text-secondary))] mr-1">View:</span>
        <div className="flex gap-1 p-1 rounded-xl bg-surface-muted w-fit">
          {VIEW_OPTIONS.map((opt) => (
            <Link
              key={opt.id}
              href={buildQuery({ view: opt.id })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === opt.id
                  ? "bg-surface-elevated text-[rgb(var(--text))] shadow-card"
                  : "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text))]"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Status filter + Hide completed */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex gap-1 p-1 rounded-xl bg-surface-muted w-fit">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab.id}
              href={buildQuery({ status: tab.id })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === tab.id
                  ? "bg-surface-elevated text-[rgb(var(--text))] shadow-card"
                  : "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text))]"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        {doneCount > 0 && (
          <Link
            href={buildQuery({ hideDone: !hideDone })}
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
              hideDone
                ? "text-[rgb(var(--text-tertiary))] hover:bg-surface-muted hover:text-[rgb(var(--text))]"
                : "bg-surface-muted text-[rgb(var(--text))]"
            }`}
          >
            {hideDone ? "Show completed" : "Hide completed"}
          </Link>
        )}
      </div>

      <p className="text-sm text-[rgb(var(--text-tertiary))] mb-4">
        {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        {statusFilter === "all" && totalCount > 0 && ` · ${openCount} open · ${doneCount} done`}
      </p>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-12 text-center">
          <p className="text-[rgb(var(--text-secondary))]">
            {statusFilter !== "all" || hideDone
              ? "No tasks match this filter."
              : "No tasks yet. Add tasks from a project → associate page."}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-[rgb(var(--accent))] hover:underline"
          >
            Go to projects
          </Link>
        </div>
      ) : view === "person" ? (
        <ByPersonView tasks={tasks} />
      ) : view === "project" ? (
        <ByProjectView tasks={tasks} />
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} showContext />
          ))}
        </ul>
      )}
    </div>
  );
}

function ByPersonView({ tasks }: { tasks: TaskWithRelations[] }) {
  const byPerson = new Map<
    string,
    { associate: TaskWithRelations["associate"]; tasks: TaskWithRelations[] }
  >();
  for (const task of tasks) {
    const key = task.associate.id;
    if (!byPerson.has(key)) {
      byPerson.set(key, { associate: task.associate, tasks: [] });
    }
    byPerson.get(key)!.tasks.push(task);
  }
  const sorted = Array.from(byPerson.values()).sort((a, b) =>
    a.associate.name.localeCompare(b.associate.name)
  );

  return (
    <div className="space-y-6">
      {sorted.map(({ associate, tasks: personTasks }) => {
        const done = personTasks.filter((t) => t.status === "done").length;
        return (
          <section
            key={associate.id}
            className="rounded-2xl border border-border-subtle bg-surface-elevated overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border-subtle bg-surface-muted/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <Link
                  href={`/project/${associate.project.id}/associate/${associate.id}`}
                  className="font-medium text-[rgb(var(--text))] hover:text-[rgb(var(--accent))] transition-colors"
                >
                  {associate.name}
                </Link>
                <span className="text-[rgb(var(--text-tertiary))]">·</span>
                <Link
                  href={`/project/${associate.project.id}`}
                  className="text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors"
                >
                  {associate.project.name}
                </Link>
              </div>
              <span className="text-sm text-[rgb(var(--text-tertiary))]">
                {personTasks.length} task{personTasks.length !== 1 ? "s" : ""}
                {done > 0 && ` · ${done} done`}
              </span>
            </div>
            <ul className="divide-y divide-border-subtle">
              {personTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ByProjectView({ tasks }: { tasks: TaskWithRelations[] }) {
  const byProject = new Map<
    string,
    { project: { id: string; name: string }; tasks: TaskWithRelations[] }
  >();
  for (const task of tasks) {
    const key = task.associate.project.id;
    if (!byProject.has(key)) {
      byProject.set(key, { project: task.associate.project, tasks: [] });
    }
    byProject.get(key)!.tasks.push(task);
  }
  const sorted = Array.from(byProject.values()).sort((a, b) =>
    a.project.name.localeCompare(b.project.name)
  );

  return (
    <div className="space-y-6">
      {sorted.map(({ project, tasks: projectTasks }) => {
        const done = projectTasks.filter((t) => t.status === "done").length;
        return (
          <section
            key={project.id}
            className="rounded-2xl border border-border-subtle bg-surface-elevated overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border-subtle bg-surface-muted/50 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/project/${project.id}`}
                className="font-medium text-[rgb(var(--text))] hover:text-[rgb(var(--accent))] transition-colors"
              >
                {project.name}
              </Link>
              <span className="text-sm text-[rgb(var(--text-tertiary))]">
                {projectTasks.length} task{projectTasks.length !== 1 ? "s" : ""}
                {done > 0 && ` · ${done} done`}
              </span>
            </div>
            <ul className="divide-y divide-border-subtle">
              {projectTasks.map((task) => (
                <TaskRow key={task.id} task={task} showAssociateOnly />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
