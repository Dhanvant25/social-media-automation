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

    // Get generated images from posts
    const imagesResult = await pool.query(
      `
      SELECT id, image_prompt as prompt, image_url, ai_model, created_at
      FROM social_posts 
      WHERE user_id = $1 AND image_url IS NOT NULL AND image_prompt IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 50
    `,
      [userId],
    )

    const images = imagesResult.rows.map((row) => ({
      id: row.id,
      prompt: row.prompt,
      imageUrl: row.image_url,
      aiModel: row.ai_model || "dall-e",
      createdAt: new Date(row.created_at),
    }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error fetching generated images:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
