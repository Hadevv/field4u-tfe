import { NextRequest, NextResponse } from "next/server";
import { AUTH_ERRORS } from "../../../auth/error/auth-error-mapping";

export async function POST(request: NextRequest) {
  try {
    const { error } = await request.json();

    const errorMessage =
      AUTH_ERRORS[error] ||
      "une erreur inconnue s'est produite. veuillez réessayer plus tard.";

    return NextResponse.json({ error, errorMessage });
  } catch (error) {
    return NextResponse.json(
      {
        error: "erreur lors du traitement",
        errorMessage:
          "une erreur s'est produite lors du traitement de votre demande",
      },
      { status: 500 },
    );
  }
}
