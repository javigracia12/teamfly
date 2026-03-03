"use client";

import Link from "next/link";
import type { Meeting, Associate, ClientFile } from "@prisma/client";
import type { Task } from "@prisma/client";
import { LayoutGrid, Calendar, Users, CheckSquare, Briefcase } from "lucide-react";
import { MeetingList } from "./MeetingList";
import { AssociateList } from "./AssociateList";
import { ClientFileList } from "./ClientFileList";
import { ProjectDashboard } from "./ProjectDashboard";
import { TasksDashboard } from "./TasksDashboard";

type AssociateWithCount = Associate & {
  _count: { tasks: number; feedback: number };
};

type TaskWithRelations = Task & {
  associate: {
    id: string;
    name: string;
    projectId: string;
    project: { id: string; name: string };
  };
};

type Props = {
  projectId: string;
  currentTab: string;
  projectName: string;
  meetings: Meeting[];
  associates: AssociateWithCount[];
  clientFiles: ClientFile[];
  openTasksForDashboard: { id: string; title: string; status: string; associate: { id: string; name: string } }[];
  upcomingMeetings: Meeting[];
  allTasks: TaskWithRelations[];
  taskFiltered: TaskWithRelations[];
  taskStatus: string;
  taskHideDone: boolean;
  taskView: "person" | "project" | "list";
  taskDoneCount: number;
};

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "meetings", label: "Meetings", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "clients", label: "Clients", icon: Briefcase },
] as const;

export function ProjectTabs({
  projectId,
  currentTab,
  projectName,
  meetings,
  associates,
  clientFiles,
  openTasksForDashboard,
  upcomingMeetings,
  allTasks,
  taskFiltered,
  taskStatus,
  taskHideDone,
  taskView,
  taskDoneCount,
}: Props) {
  const active = TABS.find((t) => t.id === currentTab)?.id ?? "dashboard";

  return (
    <div>
      <div className="flex gap-1 p-1 rounded-xl bg-surface-muted w-fit mb-8">
        {TABS.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/project/${projectId}?tab=${id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              active === id
                ? "bg-surface-elevated text-[rgb(var(--text))] shadow-card"
                : "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text))]"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>

      {active === "dashboard" && (
        <ProjectDashboard
          projectId={projectId}
          projectName={projectName}
          associates={associates}
          openTasks={openTasksForDashboard}
          upcomingMeetings={upcomingMeetings}
          clientFiles={clientFiles}
        />
      )}
      {active === "meetings" && (
        <MeetingList projectId={projectId} meetings={meetings} />
      )}
      {active === "team" && (
        <AssociateList projectId={projectId} associates={associates} />
      )}
      {active === "tasks" && (
        <TasksDashboard
          tasks={taskFiltered}
          allTasks={allTasks}
          statusFilter={taskStatus}
          hideDone={taskHideDone}
          view={taskView}
          totalCount={allTasks.length}
          doneCount={taskDoneCount}
          projectBaseUrl={`/project/${projectId}`}
        />
      )}
      {active === "clients" && (
        <ClientFileList projectId={projectId} clientFiles={clientFiles} />
      )}
    </div>
  );
}
