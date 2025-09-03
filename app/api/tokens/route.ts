import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { pool } from "@/lib/db"
import { encrypt } from "@/lib/encryption"

// GET - Fetch all tokens for user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [session.user.email])
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Get social media tokens
    const socialTokens = await pool.query(
      `
      SELECT id, platform, token_name, is_active, created_at, updated_at
      FROM api_tokens 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `,
      [userId],
    )

    // Get AI provider keys
    const aiProviders = await pool.query(
      `
      SELECT id, provider_name, is_active, created_at
      FROM ai_providers 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `,
      [userId],
    )

    return NextResponse.json({
      socialTokens: socialTokens.rows,
      aiProviders: aiProviders.rows,
    })
  } catch (error) {
    console.error("Error fetching tokens:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add new token
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, platform, tokenName, token, providerName } = body

    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [session.user.email])
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult.rows[0].id
    const encryptedToken = encrypt(token)

    if (type === "social") {
      const result = await pool.query(
        `
        INSERT INTO api_tokens (user_id, platform, token_name, encrypted_token)
        VALUES ($1, $2, $3, $4)
        RETURNING id, platform, token_name, is_active, created_at
      `,
        [userId, platform, tokenName, encryptedToken],
      )

      return NextResponse.json({ token: result.rows[0] }, { status: 201 })
    } else if (type === "ai") {
      const result = await pool.query(
        `
        INSERT INTO ai_providers (user_id, provider_name, encrypted_api_key)
        VALUES ($1, $2, $3)
        RETURNING id, provider_name, is_active, created_at
      `,
        [userId, providerName, encryptedToken],
      )

      return NextResponse.json({ provider: result.rows[0] }, { status: 201 })
    }

    return NextResponse.json({ error: "Invalid token type" }, { status: 400 })
  } catch (error) {
    console.error("Error adding token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
