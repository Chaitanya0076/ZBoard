"use client"

import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return <>
        <ClerkProvider appearance={{ baseTheme: dark}}>
            <ThemeProvider attribute="class" defaultTheme="dark">
                {children}
            </ThemeProvider>
        </ClerkProvider>
    </>;
}