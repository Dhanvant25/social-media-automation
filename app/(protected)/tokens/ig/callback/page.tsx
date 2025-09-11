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

export default function InstagramCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const generateIgAccessToken = async (code: string) => {
    const shortTokenRes = await axios.get(
      "https://api.instagram.com/oauth/access_token",
      {
        params: {
          client_id: process.env.NEXT_PUBLIC_IG_APP_ID,
          client_secret: process.env.NEXT_PUBLIC_IG_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: process.env.NEXT_PUBLIC_IG_REDIRECT_URI,
          code,
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

    console.log("Long Lived Token", longLivedToken);

    if (longLivedToken) {
      const platform = platforms.find(
        (platform) => platform.key == "instagram"
      );
      if (platform) {
        saveSocialMediaTokens(platform.id, longLivedToken, null, null, true);
        // router.push("/tokens");
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
    console.log("Code======>", code);
    console.log("Platforms========>", platforms);
    if (code && platforms.length > 0) {
      generateIgAccessToken(code);
    }
  }, [code, platforms]);

  return (
    <div>
      <h1>Instagram Callback</h1>
    </div>
  );
}
