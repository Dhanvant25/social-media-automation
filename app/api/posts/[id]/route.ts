import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { getServerSession } from "next-auth"

// GET - Fetch single post
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await pool.query(
      `
      SELECT p.* FROM social_posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1 AND u.email = $2
    `,
      [params.id, session.user.email],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post: result.rows[0] })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update post
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, platforms, scheduledTime, imageUrl, imagePrompt, aiModel } = body

    const result = await pool.query(
      `
      UPDATE social_posts 
      SET content = $1, platforms = $2, scheduled_time = $3, image_url = $4, 
          image_prompt = $5, ai_model = $6, updated_at = NOW()
      FROM users u
      WHERE social_posts.id = $7 AND social_posts.user_id = u.id AND u.email = $8
      RETURNING social_posts.*
    `,
      [content, platforms, new Date(scheduledTime), imageUrl, imagePrompt, aiModel, params.id, session.user.email],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post: result.rows[0] })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await pool.query(
      `
      DELETE FROM social_posts 
      USING users u
      WHERE social_posts.id = $1 AND social_posts.user_id = u.id AND u.email = $2
      RETURNING social_posts.id
    `,
      [params.id, session.user.email],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
