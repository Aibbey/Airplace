import { NextResponse } from "next/server";

const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""; 

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");
  
  if (!PUBLIC_BASE_URL) {
      console.error("NEXT_PUBLIC_SITE_URL is not defined in environment variables.");
      return NextResponse.json({ error: "Configuration Error: Missing public site URL." }, { status: 500 });
  }

  const clientCallbackUrl = new URL("/auth/discord/callback", PUBLIC_BASE_URL);
  
  if (code) {
    clientCallbackUrl.searchParams.set("code", code);
  }
  if (state) {
    clientCallbackUrl.searchParams.set("state", state);
  }
  if (errorParam) {
    clientCallbackUrl.searchParams.set("error", errorParam);
  }

  return NextResponse.redirect(clientCallbackUrl);
}