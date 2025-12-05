import { NextResponse } from "next/server";

export async function GET() {
    try {
        const retabApiKey = process.env.RETAB_API_KEY;

        if (!retabApiKey) {
            return NextResponse.json(
                { error: "RETAB_API_KEY is not set" },
                { status: 500 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_RETAB_BASE_URL}/v1/auth/session`,
            {
                method: "POST",
                headers: {
                    "Api-Key": retabApiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ttl: 3600 }),
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to get session token" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ token: data.token });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}