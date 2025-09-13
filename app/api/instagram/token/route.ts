// app/api/instagram/token/route.ts (Next.js 13+)
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    console.log(
      "==========================================CALL MY IG BG API=========================================="
    );

    const formData = new URLSearchParams();
    // formData.append("client_id", process.env.NEXT_PUBLIC_IG_APP_ID!);
    // formData.append("client_secret", process.env.NEXT_PUBLIC_IG_APP_SECRET!);
    // formData.append("grant_type", "authorization_code");
    // formData.append("redirect_uri", process.env.NEXT_PUBLIC_IG_REDIRECT_URI!);
    formData.append("client_id", "1129344475914140");
    formData.append("client_secret", "6f2a10e8fc37c96f7d51bc6ac6fa7406");
    formData.append("grant_type", "authorization_code");
    formData.append(
      "redirect_uri",
      "https://social-media-automation-d9vjebdmf-dhanvant-sonagaras-projects.vercel.app/tokens/ig/callback"
    );
    formData.append("code", code);

    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Instagram Token Error",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to get Instagram token", details: error.response?.data },
      { status: 500 }
    );
  }
}
