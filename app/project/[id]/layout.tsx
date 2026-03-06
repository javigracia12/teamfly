import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { getPrisma } from "@/lib/prisma";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prisma = await getPrisma();
  const project = await prisma.project.findUnique({
    where: { id },
    select: { name: true },
  });

  if (!project) notFound();

  return (
    <div className="flex min-h-screen">
      <Sidebar projectId={id} projectName={project.name} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
