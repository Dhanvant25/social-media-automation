"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { saveSocialMediaTokens } from "@/lib/social-media";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getPlatforms } from "@/lib/posts";

interface Platform {
  id: string;
  label: string;
  key: string;
}

export default function FacebookCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const generateFbAccessToken = async (code: string) => {
    // const shortTokenRes = await axios.post(
    //   "https://graph.facebook.com/v23.0/oauth/access_token",
    //   {
    //     client_id: process.env.NEXT_PUBLIC_APP_ID,
    //     client_secret: process.env.NEXT_PUBLIC_APP_SECRET,
    //     redirect_uri: process.env.NEXT_PUBLIC_FB_REDIRECT_URI,
    //     code,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   }
    // );

    // const shortTokenRes = await axios.post("/api/instagram/token", {
    //   code,
    // });

    const shortTokenRes = await axios.get(
      "https://graph.facebook.com/v23.0/oauth/access_token",
      {
        params: {
          client_id: process.env.NEXT_PUBLIC_APP_ID!,
          client_secret: process.env.NEXT_PUBLIC_APP_SECRET!,
          redirect_uri: process.env.NEXT_PUBLIC_FB_REDIRECT_URI!,
          code,
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

    const pageTokenRes = await axios.get(
      `https://graph.facebook.com/v23.0/me/accounts`,
      {
        params: {
          access_token: longLivedToken,
        },
      }
    );

    const pages = pageTokenRes.data.data;
    const pageToken = pages[0]?.access_token || null;
    const pageId = pages[0]?.id || null;

    if (longLivedToken) {
      const platform = platforms.find((platform) => platform.key == "facebook");
      if (platform) {
        saveSocialMediaTokens(
          platform.id,
          longLivedToken,
          pageToken,
          pageId,
          true
        );
        router.push("/tokens");
      }
    }
  };

  const fetchAllPlatforms = async () => {
    const res = await getPlatforms();

    if (res) {
      setPlatforms(res);
    }
  };

  useEffect(() => {
    fetchAllPlatforms();
  }, []);

  useEffect(() => {
    if (code && platforms.length > 0) {
      generateFbAccessToken(code);
    }
  }, [code, platforms]);

  return (
    <div>
      <h1>Facebook Callback</h1>
    </div>
  );
}
