import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AssociateDetail } from "@/components/AssociateDetail";

export default async function AssociatePage({
  params,
}: {
  params: Promise<{ id: string; associateId: string }>;
}) {
  const { id: projectId, associateId } = await params;

  const [project, associate] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true },
    }),
    prisma.associate.findUnique({
      where: { id: associateId },
      include: {
        tasks: { orderBy: { id: "asc" } },
        feedback: { orderBy: { createdAt: "desc" } },
      },
    }),
  ]);

  if (!project || !associate || associate.projectId !== projectId) {
    notFound();
  }

  return (
    <>
      <nav className="flex items-center gap-2 text-sm text-[rgb(var(--text-tertiary))] mb-6">
        <Link href={`/project/${projectId}`} className="hover:text-[rgb(var(--text-secondary))] transition-colors">
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-[rgb(var(--text))]">{associate.name}</span>
      </nav>
      <AssociateDetail
        projectId={projectId}
        associate={associate}
        tasks={associate.tasks}
        feedback={associate.feedback}
      />
    </>
  );
}
