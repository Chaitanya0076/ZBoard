import OrgSwitcher from "@/components/OrgSwitcher";
import { getOrganization } from "../../../../actions/organization";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProjectList from "./_components/ProjectList";
import UserIssues from "./_components/UserIssues";

const Organizations = async({params}:{
    params:{
        orgId:string
    }
}) =>{
    const {orgId} = await params;
    const { userId } = await auth();

    if(!userId){
        redirect("/signin");
    }
    console.log("orgName",orgId);
    const organization = await getOrganization(orgId); //it is organization name
    console.log("organization",organization);

    if(!organization){
        return <h1>Organization not found</h1>
    }
    return (
        <div className="container mx-auto">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
                <h1 className="text-5xl font-bold gradient-title pb-2">{organization.name}&rsquo;s Projects</h1>
                <OrgSwitcher />
            </div>
                <div className="mb-4">
                <ProjectList orgId={organization.id} />
            </div>
            <div className="mt-8">
                <UserIssues userId={userId} />
            </div>
        </div>
    )
}

export default Organizations;