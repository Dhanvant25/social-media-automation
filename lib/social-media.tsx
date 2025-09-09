import { supabase } from "./supabase";

// Save social media tokens
export async function saveSocialMediaTokens(
  platform: string,
  accessToken: string
) {
  const { data, error } = await supabase.from("socialMedia").insert([
    {
      platform,
      accessToken,
    },
  ]);

  if (error) throw error;
  return data;
}
