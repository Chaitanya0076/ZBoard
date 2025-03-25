import React from "react";
import { SignIn } from "@clerk/nextjs"

function SignInPage() {
  return (
    <div className="h-screen flex items-center justify-center"><SignIn /></div>
  )
}

export default SignInPage