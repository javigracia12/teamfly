import { Sidebar } from "@/components/Sidebar";
import { getPrisma } from "@/lib/prisma";
import { setCurrentProject } from "@/lib/actions";
import { CreateProjectForm } from "@/components/CreateProjectForm";

export default async function ProjectsPage() {
  const prisma = await getPrisma();
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { meetings: true, associates: true, clientFiles: true },
      },
    },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-8 py-12">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Switch project
          </h1>
          <p className="text-[rgb(var(--text-tertiary))] mb-8">
            You work on one project at a time. Pick one to open.
          </p>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-16 text-center">
              <p className="text-[rgb(var(--text-secondary))] mb-6">
                No projects yet. Create one to get started.
              </p>
              <CreateProjectForm createAndOpen />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <CreateProjectForm createAndOpen />
              </div>
              <ul className="space-y-2">
                {projects.map((p) => (
                  <li key={p.id}>
                    <form action={setCurrentProject.bind(null, p.id)}>
                      <button
                        type="submit"
                        className="w-full text-left rounded-xl border border-border-subtle bg-surface-elevated p-5 hover:border-border hover:shadow-soft transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="font-medium text-[rgb(var(--text))]">
                              {p.name}
                            </h2>
                            <p className="mt-1 text-sm text-[rgb(var(--text-tertiary))]">
                              {p._count.meetings} meetings · {p._count.associates} associates · {p._count.clientFiles} clients
                            </p>
                          </div>
                          <span className="text-[rgb(var(--text-tertiary))]">
                            Open →
                          </span>
                        </div>
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
