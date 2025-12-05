"use client";

import { ReactNode } from "react";
import { RetabProvider } from "@retab/react";
import "@retab/react/styles.css";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <RetabProvider
            projectId={process.env.NEXT_PUBLIC_RETAB_PROJECT_ID!}
            authConfig={{
                getToken: async () => {
                    const response = await fetch("/api/retab/token");
                    if (!response.ok) {
                        throw new Error("Failed to get Retab token");
                    }
                    const { token } = await response.json();
                    return token;
                },
                // Base URL for Retab API (same as token endpoint uses)
                baseUrl: process.env.NEXT_PUBLIC_RETAB_BASE_URL || "https://api.retab.com",
            }}
        >
            {children}
        </RetabProvider>
    );
}

