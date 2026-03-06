import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/Sidebar";
import { getPrisma } from "@/lib/prisma";
import { TasksDashboard } from "@/components/TasksDashboard";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; hideDone?: string; view?: string }>;
}) {
  const prisma = await getPrisma();
  const resolvedParams = await searchParams;
  const cookieStore = await cookies();
  const currentId = cookieStore.get("currentProjectId")?.value;
  if (currentId) {
    const project = await prisma.project.findUnique({
      where: { id: currentId },
      select: { id: true },
    });
    if (project) {
      const params = new URLSearchParams({ tab: "tasks" });
      const { status, hideDone: h, view: v } = resolvedParams;
      if (status && status !== "all") params.set("status", status);
      if (h === "1") params.set("hideDone", "1");
      if (v && v !== "person") params.set("view", v);
      redirect(`/project/${currentId}?${params.toString()}`);
    }
  }

  const statusFilter = resolvedParams.status ?? "all";
  const hideDoneParam = resolvedParams.hideDone;
  const viewParam = resolvedParams.view ?? "person";
  const hideDone = hideDoneParam === "1";
  const view = viewParam === "project" || viewParam === "list" ? viewParam : "person";

  const allTasks = await prisma.task.findMany({
    orderBy: { id: "asc" },
    include: {
      associate: {
        include: {
          project: { select: { id: true, name: true } },
        },
      },
    },
  });

  const tasks =
    statusFilter === "all"
      ? allTasks
      : allTasks.filter((t) => t.status === statusFilter);
  const filteredTasks = hideDone ? tasks.filter((t) => t.status !== "done") : tasks;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Tasks</h1>
          <p className="text-[rgb(var(--text-tertiary))] mb-6">
            See who has what. Switch view to see by person, by project, or a flat list.
          </p>
          <TasksDashboard
            tasks={filteredTasks}
            allTasks={allTasks}
            statusFilter={statusFilter}
            hideDone={hideDone}
            view={view}
            totalCount={allTasks.length}
            doneCount={allTasks.filter((t) => t.status === "done").length}
          />
        </div>
      </main>
    </div>
  );
}
