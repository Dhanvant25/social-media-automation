import { supabase } from "./supabase";

export async function getToken() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session?.access_token;
}

export async function getRefreshToken() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session?.refresh_token;
}
