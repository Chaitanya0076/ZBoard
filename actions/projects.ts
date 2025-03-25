"use server"

import prisma from "@/db";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data) {
    const { userId, orgId } = await auth();

    console.log("userId",userId);
    console.log("orgId",orgId);
  
    if (!userId) {
      throw new Error("Unauthorized");
    }
  
    if (!orgId) {
      throw new Error("No Organization Selected");
    }

    const client = await clerkClient();

    const { data : membership } = await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    // console.log("membership", membership);
  
    // If user is not a member, return null
    const userMemberShip = membership.find((m:any) => m.publicUserData.userId === userId);

    if(!userMemberShip || userMemberShip.role !== "org:admin") {
      throw new Error("Only organization admins can create projects");
    }
    

    try{
      const project = await prisma.project.create({
        data:{
          name:data.name,
          key:data.key,
          description:data.description,
          organizationId:orgId
        }
      });
      return project;
    }catch(e){
      console.log("Error",e);
      throw new Error("Error creating project");
    }
}

export async function getProject(projectId : string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Find user to verify existence
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get project with sprints and organization
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Verify project belongs to the organization
  if (project.organizationId !== orgId) {
    return null;
  }

  return project;
}
export async function deleteProject(projectId: string) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete projects");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}