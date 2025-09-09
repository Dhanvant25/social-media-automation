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
    const res = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      {
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_IG_APP_ID,
          client_secret: process.env.NEXT_PUBLIC_IG_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: process.env.NEXT_PUBLIC_IG_REDIRECT_URI,
          code,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (res.data) {
      saveSocialMediaTokens("instagram", res.data.access_token);
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
