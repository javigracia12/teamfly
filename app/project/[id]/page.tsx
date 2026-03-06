import { getPrisma } from "@/lib/prisma";
import { ProjectTabs } from "@/components/ProjectTabs";
import { ProjectHeader } from "@/components/ProjectHeader";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; status?: string; hideDone?: string; view?: string }>;
}) {
  const { id } = await params;
  const prisma = await getPrisma();
  const searchParamsRes = await searchParams;
  const tab = searchParamsRes.tab ?? "dashboard";
  const taskStatus = searchParamsRes.status ?? "all";
  const taskHideDoneParam = searchParamsRes.hideDone;
  const taskViewParam = searchParamsRes.view ?? "person";
  const taskHideDone = taskHideDoneParam === "1";
  const taskView =
    taskViewParam === "project" || taskViewParam === "list" ? taskViewParam : "person";

  const now = new Date();
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      meetings: { orderBy: { scheduledAt: "asc" } },
      associates: { include: { _count: { select: { tasks: true, feedback: true } } } },
      clientFiles: true,
    },
  });

  if (!project) return null;

  const allTasks = await prisma.task.findMany({
    where: { associate: { projectId: id } },
    orderBy: { id: "asc" },
    include: {
      associate: {
        include: {
          project: { select: { id: true, name: true } },
        },
      },
    },
  });

  const openTasks = allTasks.filter((t) => t.status !== "done");
  const upcomingMeetings = project.meetings.filter((m) => new Date(m.scheduledAt) >= now);

  const taskFiltered =
    taskStatus === "all"
      ? allTasks
      : allTasks.filter((t) => t.status === taskStatus);
  const taskFilteredFinal = taskHideDone
    ? taskFiltered.filter((t) => t.status !== "done")
    : taskFiltered;

  return (
    <>
      <ProjectHeader project={project} />
      <ProjectTabs
        projectId={id}
        currentTab={tab}
        projectName={project.name}
        meetings={project.meetings}
        associates={project.associates}
        clientFiles={project.clientFiles}
        openTasksForDashboard={openTasks.map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status,
          associate: { id: t.associate.id, name: t.associate.name },
        }))}
        upcomingMeetings={upcomingMeetings}
        allTasks={allTasks}
        taskFiltered={taskFilteredFinal}
        taskStatus={taskStatus}
        taskHideDone={taskHideDone}
        taskView={taskView}
        taskDoneCount={allTasks.filter((t) => t.status === "done").length}
      />
    </>
  );
}
