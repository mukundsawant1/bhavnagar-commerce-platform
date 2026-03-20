import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email query parameter is required." }, { status: 400 });
  }

  // OWASP account enumeration protection: do not reveal whether the account exists.
  return NextResponse.json({
    canProceed: true,
    message:
      "If this email is registered, you will receive the next step instructions."
  });
}
