import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientFileDetail } from "@/components/ClientFileDetail";

export default async function ClientFilePage({
  params,
}: {
  params: Promise<{ id: string; clientId: string }>;
}) {
  const { id: projectId, clientId } = await params;

  const [project, client] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true },
    }),
    prisma.clientFile.findUnique({
      where: { id: clientId },
    }),
  ]);

  if (!project || !client || client.projectId !== projectId) {
    notFound();
  }

  return (
    <>
      <nav className="flex items-center gap-2 text-sm text-[rgb(var(--text-tertiary))] mb-6">
        <Link href={`/project/${projectId}`} className="hover:text-[rgb(var(--text-secondary))] transition-colors">
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-[rgb(var(--text))]">{client.clientName}</span>
      </nav>
      <ClientFileDetail projectId={projectId} client={client} />
    </>
  );
}
