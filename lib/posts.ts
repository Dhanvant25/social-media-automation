import { supabase } from "./supabase";

// Fetch all posts
export async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

//  Create new post
export async function createPost(
  content: string,
  platforms: string[],
  scheduledTime: Date,
  imageUrl: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        content,
        platforms,
        scheduledTime,
        imageUrl,
        userId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
