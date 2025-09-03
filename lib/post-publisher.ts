import { pool } from "./db"
import { decrypt } from "./encryption"
import { SocialMediaAPI } from "./social-apis"

export class PostPublisher {
  static async publishScheduledPosts() {
    try {
      // Get posts that are due for publishing
      const postsResult = await pool.query(`
        SELECT p.*, u.email 
        FROM social_posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.status = 'pending' 
        AND p.scheduled_time <= NOW()
        ORDER BY p.scheduled_time ASC
        LIMIT 10
      `)

      for (const post of postsResult.rows) {
        await this.publishPost(post)
      }
    } catch (error) {
      console.error("Error in scheduled post publishing:", error)
    }
  }

  static async publishPost(post: any) {
    try {
      // Update status to processing
      await pool.query("UPDATE social_posts SET status = $1 WHERE id = $2", ["processing", post.id])

      const results = []

      // Publish to each platform
      for (const platform of post.platforms) {
        try {
          const result = await this.publishToPlatform(post, platform)
          results.push({ platform, success: true, result })
        } catch (error) {
          results.push({
            platform,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }

      // Check if all platforms succeeded
      const allSucceeded = results.every((r) => r.success)
      const someSucceeded = results.some((r) => r.success)

      let status = "failed"
      let errorMessage = null

      if (allSucceeded) {
        status = "posted"
      } else if (someSucceeded) {
        status = "partial"
        errorMessage = `Failed on: ${results
          .filter((r) => !r.success)
          .map((r) => r.platform)
          .join(", ")}`
      } else {
        errorMessage = results.map((r) => `${r.platform}: ${r.error}`).join("; ")
      }

      // Update post status
      await pool.query(
        `
        UPDATE social_posts 
        SET status = $1, posted_at = $2, error_message = $3, updated_at = NOW()
        WHERE id = $4
      `,
        [status, allSucceeded ? new Date() : null, errorMessage, post.id],
      )
    } catch (error) {
      // Update post with error
      await pool.query(
        `
        UPDATE social_posts 
        SET status = 'failed', error_message = $1, updated_at = NOW()
        WHERE id = $2
      `,
        [error instanceof Error ? error.message : "Unknown error", post.id],
      )
    }
  }

  static async publishToPlatform(post: any, platform: string) {
    // Get platform API token
    const tokenResult = await pool.query(
      `
      SELECT encrypted_token FROM api_tokens 
      WHERE user_id = $1 AND platform = $2 AND is_active = true
    `,
      [post.user_id, platform],
    )

    if (tokenResult.rows.length === 0) {
      throw new Error(`No active token found for ${platform}`)
    }

    const accessToken = decrypt(tokenResult.rows[0].encrypted_token)

    const postData = {
      content: post.content,
      imageUrl: post.image_url,
    }

    const config = { accessToken }

    switch (platform) {
      case "twitter":
        return await SocialMediaAPI.postToTwitter(postData, config)
      case "instagram":
        return await SocialMediaAPI.postToInstagram(postData, config)
      case "linkedin":
        return await SocialMediaAPI.postToLinkedIn(postData, config)
      case "facebook":
        return await SocialMediaAPI.postToFacebook(postData, config)
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }
}
