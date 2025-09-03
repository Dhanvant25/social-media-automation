import { createServerComponentClient } from "./supabase"

// Get Supabase client for server-side operations
export const getSupabaseServer = () => {
  return createServerComponentClient()
}

// Database initialization for Supabase
export const initSupabaseDB = async () => {
  const supabase = getSupabaseServer()

  // Create tables using Supabase SQL
  const { error } = await supabase.rpc("create_tables", {
    sql: `
      -- Create users table (extends auth.users)
      CREATE TABLE IF NOT EXISTS public.user_profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        name TEXT,
        settings JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create api_tokens table
      CREATE TABLE IF NOT EXISTS public.api_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        token_name VARCHAR(255) NOT NULL,
        encrypted_token TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create ai_providers table
      CREATE TABLE IF NOT EXISTS public.ai_providers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        provider_name VARCHAR(50) NOT NULL,
        encrypted_api_key TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create social_posts table
      CREATE TABLE IF NOT EXISTS public.social_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        platforms TEXT[] NOT NULL,
        scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        image_url TEXT,
        image_prompt TEXT,
        ai_model VARCHAR(50),
        posted_at TIMESTAMP WITH TIME ZONE,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.social_posts(user_id);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON public.social_posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_scheduled_time ON public.social_posts(scheduled_time);
      CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON public.api_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_ai_providers_user_id ON public.ai_providers(user_id);

      -- Enable RLS (Row Level Security)
      ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      CREATE POLICY "Users can view own profile" ON public.user_profiles
        FOR ALL USING (auth.uid() = id);

      CREATE POLICY "Users can manage own tokens" ON public.api_tokens
        FOR ALL USING (auth.uid() = user_id);

      CREATE POLICY "Users can manage own AI providers" ON public.ai_providers
        FOR ALL USING (auth.uid() = user_id);

      CREATE POLICY "Users can manage own posts" ON public.social_posts
        FOR ALL USING (auth.uid() = user_id);

      -- Create trigger for updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      CREATE TRIGGER update_api_tokens_updated_at BEFORE UPDATE ON public.api_tokens
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON public.social_posts
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `,
  })

  if (error) {
    console.error("Error initializing Supabase database:", error)
    throw error
  }
}
