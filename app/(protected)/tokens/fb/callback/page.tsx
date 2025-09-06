"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function FacebookCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const generateFbAccessToken = async (code: string) => {
    const res = await fetch(
      "https://graph.facebook.com/v23.0/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_APP_ID,
          client_secret: process.env.NEXT_PUBLIC_APP_SECRET,
          redirect_uri: process.env.NEXT_PUBLIC_FB_REDIRECT_URI,
          code,
        }),
      }
    );

    const data = await res.json();
    console.log("Facebook Data", data);
  };

  useEffect(() => {
    if (code) {
      console.log("Code", code);
      generateFbAccessToken(code);
    }
  }, [code]);

  return (
    <div>
      <h1>Facebook Callback</h1>
    </div>
  );
}
