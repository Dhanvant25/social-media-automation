import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { pool } from "@/lib/db"

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

    // Get AI providers
    const providersResult = await pool.query(
      `
      SELECT provider_name, is_active, created_at,
             CASE WHEN encrypted_api_key IS NOT NULL THEN true ELSE false END as has_api_key
      FROM ai_providers 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `,
      [userId],
    )

    // Map to expected format
    const providers = [
      {
        id: "dall-e",
        name: "DALL-E 3",
        model: "dall-e",
        isActive: providersResult.rows.find((p) => p.provider_name === "dall-e")?.is_active || false,
        hasApiKey: providersResult.rows.find((p) => p.provider_name === "dall-e")?.has_api_key || false,
      },
      {
        id: "imagen",
        name: "Google Imagen",
        model: "imagen",
        isActive: providersResult.rows.find((p) => p.provider_name === "imagen")?.is_active || false,
        hasApiKey: providersResult.rows.find((p) => p.provider_name === "imagen")?.has_api_key || false,
      },
      {
        id: "llama",
        name: "LLaMA Vision",
        model: "llama",
        isActive: providersResult.rows.find((p) => p.provider_name === "llama")?.is_active || false,
        hasApiKey: providersResult.rows.find((p) => p.provider_name === "llama")?.has_api_key || false,
      },
    ]

    return NextResponse.json({ providers })
  } catch (error) {
    console.error("Error fetching AI providers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
