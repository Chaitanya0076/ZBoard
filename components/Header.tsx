import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ModeToggle } from "./ui/ModeToggle"
import Link from "next/link"
import { Button } from "./ui/button"
import { PenBox } from "lucide-react"
import UserMenu from "./UserMenu"
import { checkUser } from "@/db/check-user"
import UserLoading from "./UserLoading"
// import Image from "next/image"

async function Header() {
    await checkUser();
    return (
        <nav>
            <div className="h-[6vh] border-b-2 flex items-center justify-between px-4 max-sm:px-1">
                <Link href="/" className="flex items-center cursor-pointer">
                    {/* <Image src={'/logo.png'} width={35} height={35} alt="logo" className="object-contain" /> */}
                    <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-gray-800 to-gray-400 dark:from-gray-400 dark:to-gray-600">
                        ZBoard
                    </span>
                </Link>

                <div className="flex items-center gap-2 max-sm:gap-0.5">
                    <ModeToggle />
                    <Link href={'/projects/create'}>
                        <Button variant="destructive">
                            <PenBox size={12} />
                            <span><span className="max-sm:hidden">Create</span> Project</span>
                        </Button>
                    </Link>
                    <div className="cursor-pointer">
                        <SignedOut>
                            <SignInButton forceRedirectUrl="/onboard">
                                <Button variant="outline">LogIn</Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserMenu />
                        </SignedIn>
                    </div>
                </div>
            </div>
            <UserLoading />
        </nav>

    )
}

export default Header