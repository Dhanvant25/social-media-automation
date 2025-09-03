const { Pool } = require("pg")

async function initializeDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  })

  try {
    console.log("Initializing database...")

    await pool.query(`
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create api_tokens table
      CREATE TABLE IF NOT EXISTS api_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        token_name VARCHAR(255) NOT NULL,
        encrypted_token TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create ai_providers table
      CREATE TABLE IF NOT EXISTS ai_providers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        provider_name VARCHAR(50) NOT NULL,
        encrypted_api_key TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Create social_posts table
      CREATE TABLE IF NOT EXISTS social_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        platforms TEXT[] NOT NULL,
        scheduled_time TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        image_url TEXT,
        image_prompt TEXT,
        ai_model VARCHAR(50),
        posted_at TIMESTAMP,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_posts_user_id ON social_posts(user_id);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON social_posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_scheduled_time ON social_posts(scheduled_time);
      CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON api_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_ai_providers_user_id ON ai_providers(user_id);
    `)

    console.log("Database initialized successfully!")
  } catch (error) {
    console.error("Error initializing database:", error)
  } finally {
    await pool.end()
  }
}

initializeDatabase()
