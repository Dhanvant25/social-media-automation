import { supabase } from "./supabase";

// Create user
export async function createUser(
  userId: string,
  email: string,
  name: string,
  phone: string,
  role: string
) {
  const { data, error } = await supabase.from("users").insert([
    {
      userId,
      email,
      name,
      phone,
      role
    },
  ]);
  return { data, error };
}
