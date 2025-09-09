"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { saveSocialMediaTokens } from "@/lib/social-media";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function InstagramCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();

  const generateIgAccessToken = async (code: string) => {
    const shortTokenRes = await axios.post(
      "https://api.instagram.com/oauth/access_token",

      {
        client_id: process.env.NEXT_PUBLIC_IG_APP_ID,
        client_secret: process.env.NEXT_PUBLIC_IG_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_IG_REDIRECT_URI,
        code,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const shortLivedToken = shortTokenRes.data.access_token;
    const userId = shortTokenRes.data.user_id;

    const longTokenRes = await axios.get(
      "https://graph.instagram.com/access_token",
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: process.env.NEXT_PUBLIC_IG_APP_SECRET,
          access_token: shortLivedToken,
        },
      }
    );

    const longLivedToken = longTokenRes.data.access_token;

    if (longLivedToken) {
      saveSocialMediaTokens("instagram", longLivedToken, true);
      router.push("/tokens");
    }
  };

  useEffect(() => {
    if (code) {
      generateIgAccessToken(code);
    }
  }, [code]);

  return (
    <div>
      <h1>Instagram Callback</h1>
    </div>
  );
}
