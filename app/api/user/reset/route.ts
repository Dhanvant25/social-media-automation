import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { pool } from "@/lib/db"

export async function POST(request: NextRequest) {
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

    // Delete all user data in transaction
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Delete posts
      await client.query("DELETE FROM social_posts WHERE user_id = $1", [userId])

      // Delete API tokens
      await client.query("DELETE FROM api_tokens WHERE user_id = $1", [userId])

      // Delete AI providers
      await client.query("DELETE FROM ai_providers WHERE user_id = $1", [userId])

      // Reset user settings
      await client.query("UPDATE users SET settings = NULL, updated_at = NOW() WHERE id = $1", [userId])

      await client.query("COMMIT")

      return NextResponse.json({ success: true })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error resetting user data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
