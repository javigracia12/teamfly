import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  try {
    const cookieStore = await cookies();
    const currentId = cookieStore.get("currentProjectId")?.value;

    if (currentId) {
      const project = await prisma.project.findUnique({
        where: { id: currentId },
        select: { id: true },
      });
      if (project) redirect(`/project/${currentId}`);
    }

    await prisma.project.count();
  } catch {
    // DB not set up or unavailable — send to projects (will show setup/empty state)
  }
  redirect("/projects");
}
