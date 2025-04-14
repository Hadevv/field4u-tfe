import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ACCOUNT_LINKED_COOKIE = "account-linked";

// marquer qu'un compte vient d'être lié
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // définir un cookie pour indiquer qu'un compte vient d'être lié
    await cookieStore.set(ACCOUNT_LINKED_COOKIE, "true", {
      maxAge: 60 * 5, // 5 minutes
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

// vérifier si un compte a été récemment lié
export async function GET() {
  try {
    const cookieStore = await cookies();
    const linked = await cookieStore.get(ACCOUNT_LINKED_COOKIE);

    // si le cookie existe, supprimer le cookie et renvoyer true
    if (linked) {
      await cookieStore.delete(ACCOUNT_LINKED_COOKIE);
      return NextResponse.json({ linked: true });
    }

    return NextResponse.json({ linked: false });
  } catch (error) {
    return NextResponse.json({ linked: false });
  }
}
