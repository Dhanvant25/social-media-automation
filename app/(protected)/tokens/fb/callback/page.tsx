"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { saveSocialMediaTokens } from "@/lib/social-media";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function FacebookCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();

  const generateFbAccessToken = async (code: string) => {
    const res = await axios.post(
      "https://graph.facebook.com/v23.0/oauth/access_token",
      {
        client_id: process.env.NEXT_PUBLIC_APP_ID,
        client_secret: process.env.NEXT_PUBLIC_APP_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_FB_REDIRECT_URI,
        code,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (res.data) {
      saveSocialMediaTokens("facebook", res.data.access_token);
      router.push("/tokens");
    }
  };

  useEffect(() => {
    if (code) {
      generateFbAccessToken(code);
    }
  }, [code]);

  return (
    <div>
      <h1>Facebook Callback</h1>
    </div>
  );
}
