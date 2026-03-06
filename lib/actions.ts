"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getPrisma } from "./prisma";

const CURRENT_PROJECT_COOKIE = "currentProjectId";

export async function setCurrentProject(projectId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CURRENT_PROJECT_COOKIE, projectId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect(`/project/${projectId}`);
}

// Projects
export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name?.trim()) return;
  const prisma = await getPrisma();
  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      notes: (formData.get("notes") as string) || null,
      startDate: formData.get("startDate")
        ? new Date(formData.get("startDate") as string)
        : null,
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate") as string)
        : null,
    },
  });
  revalidatePath("/");
  revalidatePath("/projects");
  return project.id;
}

export async function createProjectAndOpen(formData: FormData) {
  const id = await createProject(formData);
  if (id) await setCurrentProject(id);
}

export async function updateProject(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  if (!name?.trim()) return;
  const prisma = await getPrisma();
  await prisma.project.update({
    where: { id },
    data: {
      name: name.trim(),
      notes: (formData.get("notes") as string) || null,
      startDate: formData.get("startDate")
        ? new Date(formData.get("startDate") as string)
        : null,
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate") as string)
        : null,
    },
  });
  revalidatePath("/");
  revalidatePath(`/project/${id}`);
}

export async function deleteProject(id: string) {
  const cookieStore = await cookies();
  if (cookieStore.get(CURRENT_PROJECT_COOKIE)?.value === id) {
    cookieStore.delete(CURRENT_PROJECT_COOKIE);
  }
  const prisma = await getPrisma();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/projects");
}

// Meetings
export async function createMeeting(projectId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const scheduledAt = formData.get("scheduledAt") as string;
  if (!title?.trim() || !scheduledAt) return;
  const prisma = await getPrisma();
  await prisma.meeting.create({
    data: {
      projectId,
      title: title.trim(),
      scheduledAt: new Date(scheduledAt),
      notes: (formData.get("notes") as string) || null,
    },
  });
  revalidatePath(`/project/${projectId}`);
}

export async function updateMeeting(
  projectId: string,
  id: string,
  formData: FormData
) {
  const title = formData.get("title") as string;
  const scheduledAt = formData.get("scheduledAt") as string;
  if (!title?.trim() || !scheduledAt) return;
  const prisma = await getPrisma();
  await prisma.meeting.update({
    where: { id },
    data: {
      title: title.trim(),
      scheduledAt: new Date(scheduledAt),
      notes: (formData.get("notes") as string) || null,
    },
  });
  revalidatePath(`/project/${projectId}`);
}

export async function deleteMeeting(projectId: string, id: string) {
  const prisma = await getPrisma();
  await prisma.meeting.delete({ where: { id } });
  revalidatePath(`/project/${projectId}`);
}

// Associates
export async function createAssociate(projectId: string, formData: FormData) {
  const name = formData.get("name") as string;
  if (!name?.trim()) return;
  const prisma = await getPrisma();
  await prisma.associate.create({
    data: {
      projectId,
      name: name.trim(),
      role: (formData.get("role") as string) || null,
    },
  });
  revalidatePath(`/project/${projectId}`);
}

export async function updateAssociate(
  projectId: string,
  id: string,
  formData: FormData
) {
  const name = formData.get("name") as string;
  if (!name?.trim()) return;
  const prisma = await getPrisma();
  await prisma.associate.update({
    where: { id },
    data: {
      name: name.trim(),
      role: (formData.get("role") as string) || null,
    },
  });
  revalidatePath(`/project/${projectId}`);
  revalidatePath(`/project/${projectId}/associate/${id}`);
}

export async function deleteAssociate(projectId: string, id: string) {
  const prisma = await getPrisma();
  await prisma.associate.delete({ where: { id } });
  revalidatePath(`/project/${projectId}`);
  redirect(`/project/${projectId}`);
}

// Tasks
export async function createTask(associateId: string, formData: FormData) {
  const title = formData.get("title") as string;
  if (!title?.trim()) return;
  const prisma = await getPrisma();
  await prisma.task.create({
    data: {
      associateId,
      title: title.trim(),
      status: (formData.get("status") as string) || "todo",
    },
  });
  const a = await prisma.associate.findUnique({
    where: { id: associateId },
    select: { projectId: true },
  });
  if (a) {
    revalidatePath(`/project/${a.projectId}`);
    revalidatePath(`/project/${a.projectId}/associate/${associateId}`);
  }
}

export async function updateTask(
  associateId: string,
  id: string,
  formData: FormData
) {
  const title = formData.get("title") as string;
  const status = formData.get("status") as string;
  const prisma = await getPrisma();
  await prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(status && { status }),
    },
  });
  const a = await prisma.associate.findUnique({
    where: { id: associateId },
    select: { projectId: true },
  });
  if (a) {
    revalidatePath(`/project/${a.projectId}`);
    revalidatePath(`/project/${a.projectId}/associate/${associateId}`);
    revalidatePath("/tasks");
  }
}

export async function toggleTaskStatus(
  associateId: string,
  taskId: string,
  status: "todo" | "in_progress" | "done"
) {
  const prisma = await getPrisma();
  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
  const a = await prisma.associate.findUnique({
    where: { id: associateId },
    select: { projectId: true },
  });
  if (a) {
    revalidatePath(`/project/${a.projectId}`);
    revalidatePath(`/project/${a.projectId}/associate/${associateId}`);
  }
  revalidatePath("/tasks");
}

export async function deleteTask(associateId: string, id: string) {
  const prisma = await getPrisma();
  await prisma.task.delete({ where: { id } });
  const a = await prisma.associate.findUnique({
    where: { id: associateId },
    select: { projectId: true },
  });
  if (a) {
    revalidatePath(`/project/${a.projectId}`);
    revalidatePath(`/project/${a.projectId}/associate/${associateId}`);
    revalidatePath("/tasks");
  }
}

// Feedback
export async function createFeedback(associateId: string, formData: FormData) {
  const content = formData.get("content") as string;
  if (!content?.trim()) return;
  const prisma = await getPrisma();
  await prisma.feedback.create({
    data: { associateId, content: content.trim() },
  });
  const a = await prisma.associate.findUnique({
    where: { id: associateId },
    select: { projectId: true },
  });
  if (a) {
    revalidatePath(`/project/${a.projectId}`);
    revalidatePath(`/project/${a.projectId}/associate/${associateId}`);
  }
}

export async function updateFeedback(
  associateId: string,
  id: string,
  formData: FormData
) {
  const content = formData.get("content") as string;
  if (!content?.trim()) return;
  const prisma = await getPrisma();
  await prisma.feedback.update({
    where: { id },
    data: { content: content.trim() },
  });
  const a = await prisma.associate.findUnique({
    where: { id: associateId },
    select: { projectId: true },
  });
  if (a) {
    revalidatePath(`/project/${a.projectId}`);
    revalidatePath(`/project/${a.projectId}/associate/${associateId}`);
  }
}

export async function deleteFeedback(associateId: string, id: string) {
  const prisma = await getPrisma();
  await prisma.feedback.delete({ where: { id } });
  const a = await prisma.associate.findUnique({
    where: { id: associateId },
    select: { projectId: true },
  });
  if (a) {
    revalidatePath(`/project/${a.projectId}`);
    revalidatePath(`/project/${a.projectId}/associate/${associateId}`);
  }
}

// Client files
export async function createClientFile(projectId: string, formData: FormData) {
  const clientName = formData.get("clientName") as string;
  if (!clientName?.trim()) return;
  const prisma = await getPrisma();
  await prisma.clientFile.create({
    data: {
      projectId,
      clientName: clientName.trim(),
      role: (formData.get("role") as string) || null,
      priorities: (formData.get("priorities") as string) || null,
      notes: (formData.get("notes") as string) || null,
    },
  });
  revalidatePath(`/project/${projectId}`);
}

export async function updateClientFile(
  projectId: string,
  id: string,
  formData: FormData
) {
  const clientName = formData.get("clientName") as string;
  if (!clientName?.trim()) return;
  const prisma = await getPrisma();
  await prisma.clientFile.update({
    where: { id },
    data: {
      clientName: clientName.trim(),
      role: (formData.get("role") as string) || null,
      priorities: (formData.get("priorities") as string) || null,
      notes: (formData.get("notes") as string) || null,
    },
  });
  revalidatePath(`/project/${projectId}`);
  revalidatePath(`/project/${projectId}/client/${id}`);
}

export async function deleteClientFile(projectId: string, id: string) {
  const prisma = await getPrisma();
  await prisma.clientFile.delete({ where: { id } });
  revalidatePath(`/project/${projectId}`);
  redirect(`/project/${projectId}`);
}
