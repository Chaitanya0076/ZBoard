"use server"

import prisma from "@/db";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug : string) {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
  
    const user = await prisma.user?.findUnique({
      where: { clerkUserId: userId },
    });
    
    if (!user) {
      throw new Error("User not found");
    }
  
    // Get the organization details
    const client = await clerkClient();
    const organization = await client.organizations.getOrganization({
         slug,
        });
    
    if (!organization) {
      console.log("Organization not found");
      return null;
    }
   
    // Check if user belongs to this organization
    const { data : membership } = await client.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

    console.log("membership", membership);
  
    // If user is not a member, return null
    const userMemberShip = membership.find((m:any) => m.publicUserData.userId === user.clerkUserId);

    if(!userMemberShip) {
      return null;
    }
  
    console.log("organizationActions",organization);
    return organization;
  }

  export async function getProjects(orgId : string) {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
  
    const user = await prisma.user?.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const projects = await prisma.project.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });
  
    return projects;
  }

  export async function getUserIssues(userId: string) {
    const { orgId } = await auth();
  
    if (!userId || !orgId) {
      throw new Error("No user id or organization id found");
    }
  
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const issues = await prisma.issue.findMany({
      where: {
        OR: [{ assigneeId: user.id }, { reporterId: user.id }],
        project: {
          organizationId: orgId,
        },
      },
      include: {
        project: true,
        assignee: true,
        reporter: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return issues;
  }

  export async function getOrganizationUsers(orgId:string) {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
  
    const user = await prisma.user?.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }

    const client = await clerkClient();

    const organizationMemberships = await client.organizations.getOrganizationMembershipList({
      organizationId: orgId
    })

    const userIds = organizationMemberships.data.map(
      (membership:any) => membership.publicUserData.userId
    );
  
    const users = await prisma.user?.findMany({
      where: {
        clerkUserId: {
          in: userIds,
        },
      },
    });
  
    return users;
  }

  export async function deleteProject(projectId : string){
      const { userId, orgId, orgRole } = await auth();

      if(!userId || !orgId){
          throw new Error("Unauthorized");
      }

      if(orgRole !== "org:admin"){
          throw new Error("Only organization admins can delete projects");
      }

      const project = await prisma.project.findUnique({
          where: { id: projectId },
      });

      if(!project || project.organizationId !== orgId){
          throw new Error("Project not found or you don't have permission to delete it");
      }

      await prisma.project.delete({
          where: { id: projectId },
      });

      return { success: true };
  }