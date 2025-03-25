"use server";

import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function createSprint(projectId : string, data:any) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { sprints: { orderBy: { createdAt: "desc" } } },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const sprint = await prisma.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId: projectId,
      updatedAt: new Date(),
    },
  });

  return sprint;
}

export async function updateSprintStatus(sprintId : string, newStatus:any) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });
    console.log(sprint, orgRole);

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
      throw new Error("Only Admin can make this change");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    const updatedSprint = await prisma.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    throw new Error(error.message);
  }
}