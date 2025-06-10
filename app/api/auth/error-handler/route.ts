import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error: errorType, message } = body;

    // Log l'erreur pour le debugging
    console.error("Erreur d'authentification:", {
      type: errorType,
      message,
      timestamp: new Date().toISOString(),
    });

    // Retourner une réponse appropriée selon le type d'erreur
    return NextResponse.json({
      success: true,
      handled: true,
      errorType,
    });
  } catch (error) {
    console.error("Erreur lors du traitement de l'erreur d'auth:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement" },
      { status: 500 },
    );
  }
}
