import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { pool } from "@/lib/db"

export const dynamic = 'force-dynamic' // Force dynamic route behavior
export const revalidate = 0 // Disable caching

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

    // Get post statistics
    const postsStats = await pool.query(
      `
      SELECT 
        COUNT(*) as total_posts,
        COUNT(CASE WHEN status = 'posted' THEN 1 END) as successful_posts,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_posts,
        COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as total_images
      FROM social_posts 
      WHERE user_id = $1
    `,
      [userId],
    )

    // Get API calls this month (approximate based on posts)
    const apiCallsResult = await pool.query(
      `
      SELECT COUNT(*) as api_calls
      FROM social_posts 
      WHERE user_id = $1 
      AND created_at >= date_trunc('month', CURRENT_DATE)
    `,
      [userId],
    )

    const stats = postsStats.rows[0]
    const apiCalls = apiCallsResult.rows[0]

    return NextResponse.json({
      stats: {
        totalPosts: Number.parseInt(stats.total_posts) || 0,
        successfulPosts: Number.parseInt(stats.successful_posts) || 0,
        failedPosts: Number.parseInt(stats.failed_posts) || 0,
        totalImages: Number.parseInt(stats.total_images) || 0,
        storageUsed: "0 MB", // This would need actual file size calculation
        apiCallsThisMonth: Number.parseInt(apiCalls.api_calls) || 0,
      },
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
