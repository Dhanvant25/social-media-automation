import { supabase } from "./supabase";

// Fetch all tags
export async function getTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Create tags
export async function createTag(name: string) {
  const { data, error } = await supabase
    .from("tags")
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch all platforms
export async function getPlatforms() {
  const { data, error } = await supabase
    .from("platforms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

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
  platforms: string,
  scheduledTime: Date,
  imageUrl: string,
  userId: string,
  tags: string
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
        tags,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
