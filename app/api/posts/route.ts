import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { getServerSession } from "next-auth"

// GET - Fetch all posts for user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const platform = searchParams.get("platform")
    const search = searchParams.get("search")

    let query = `
      SELECT p.*, u.email 
      FROM social_posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE u.email = $1
    `
    const params: any[] = [session.user.email]
    let paramCount = 1

    if (status && status !== "all") {
      paramCount++
      query += ` AND p.status = $${paramCount}`
      params.push(status)
    }

    if (platform && platform !== "all") {
      paramCount++
      query += ` AND $${paramCount} = ANY(p.platforms)`
      params.push(platform)
    }

    if (search) {
      paramCount++
      query += ` AND p.content ILIKE $${paramCount}`
      params.push(`%${search}%`)
    }

    query += " ORDER BY p.created_at DESC"

    const result = await pool.query(query, params)

    return NextResponse.json({ posts: result.rows })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, platforms, scheduledTime, imageUrl, imagePrompt, aiModel } = body

    // Validate required fields
    if (!content || !platforms || platforms.length === 0 || !scheduledTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user ID
    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [session.user.email])
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Insert post
    const insertResult = await pool.query(
      `
      INSERT INTO social_posts (user_id, content, platforms, scheduled_time, image_url, image_prompt, ai_model)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [userId, content, platforms, new Date(scheduledTime), imageUrl, imagePrompt, aiModel],
    )

    return NextResponse.json({ post: insertResult.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
