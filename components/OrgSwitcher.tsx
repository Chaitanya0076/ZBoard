"use client"

import { useOrganization, useUser, SignedIn, OrganizationSwitcher } from "@clerk/nextjs";
import { usePathname } from "next/navigation";


function OrgSwitcher() {
  const {isLoaded} = useOrganization();
  const {isLoaded: isUserLoaded} = useUser();

  const pathname = usePathname();

    if(!isLoaded || !isUserLoaded) {
        return null;
    }

  return (
    <div>
        <SignedIn>
            <OrganizationSwitcher hidePersonal afterCreateOrganizationUrl="/organization/:slug" afterSelectOrganizationUrl="/organization/:slug" createOrganizationMode={pathname === "/onboard" ? "navigation" : undefined} createOrganizationUrl="/onboard" appearance={{elements: { organizationSwitcherTrigger: "border border-gray-300 rounded-md px-5 py-2", organizationSwitcherTriggerIcon: "text-gray"}}} />
        </SignedIn>
    </div>
  )
}

export default OrgSwitcher