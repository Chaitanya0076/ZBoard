"use client"

import { UserButton } from "@clerk/nextjs"
import { ChartNoAxesGantt } from "lucide-react"

function UserMenu() {
  return (
    <UserButton
    appearance={{
        elements:{
            avatarBox:"w-10 h-10",
        }
    }}>
        <UserButton.MenuItems>
            <UserButton.Link href="/onboard" label="My Organizations" labelIcon={<ChartNoAxesGantt size={10} />}></UserButton.Link>
            <UserButton.Action label="manageAccount" />
        </UserButton.MenuItems>
    </UserButton>
  )
}

export default UserMenu