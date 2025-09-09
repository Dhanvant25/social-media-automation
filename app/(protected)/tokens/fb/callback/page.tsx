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
    const shortTokenRes = await axios.post(
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

    const shortLivedToken = shortTokenRes.data.access_token;

    const longTokenRes = await axios.get(
      "https://graph.facebook.com/v23.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.NEXT_PUBLIC_APP_ID,
          client_secret: process.env.NEXT_PUBLIC_APP_SECRET,
          fb_exchange_token: shortLivedToken,
        },
      }
    );

    const longLivedToken = longTokenRes.data.access_token;

    if (longLivedToken) {
      saveSocialMediaTokens("facebook", longLivedToken, true);
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
