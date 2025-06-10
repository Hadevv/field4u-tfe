/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ACCOUNT_LINKED_COOKIE = "account-linked";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    await cookieStore.set(ACCOUNT_LINKED_COOKIE, "true", {
      maxAge: 60 * 5,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "erreur lors du traitement" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const linked = await cookieStore.get(ACCOUNT_LINKED_COOKIE);

    if (linked) {
      await cookieStore.delete(ACCOUNT_LINKED_COOKIE);
      return NextResponse.json({ linked: true });
    }

    return NextResponse.json({ linked: false });
  } catch (error) {
    return NextResponse.json({ linked: false });
  }
}
