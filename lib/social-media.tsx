import { supabase } from "./supabase";

// Save social media tokens
export async function saveSocialMediaTokens(
  platform: string,
  accessToken: string,
  pageToken: string | null,
  pageId: string | null,
  isActive: boolean
) {
  const { data, error } = await supabase.from("socialMedia").insert([
    {
      platform,
      accessToken,
      pageToken,
      pageId,
      isActive,
    },
  ]);

  if (error) throw error;
  return data;
}
