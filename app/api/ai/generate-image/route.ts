import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { pool } from "@/lib/db"
import { decrypt } from "@/lib/encryption"
import { AIImageService } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, aiModel } = body

    if (!prompt || !aiModel) {
      return NextResponse.json({ error: "Missing prompt or AI model" }, { status: 400 })
    }

    // Get user's AI provider API key
    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [session.user.email])
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Get API key for the selected AI model
    const providerResult = await pool.query(
      `
      SELECT encrypted_api_key FROM ai_providers 
      WHERE user_id = $1 AND provider_name = $2 AND is_active = true
    `,
      [userId, aiModel],
    )

    if (providerResult.rows.length === 0) {
      return NextResponse.json({ error: "AI provider not configured" }, { status: 400 })
    }

    const apiKey = decrypt(providerResult.rows[0].encrypted_api_key)

    // Generate image based on AI model
    let result
    switch (aiModel) {
      case "dall-e":
        result = await AIImageService.generateWithDALLE(prompt, apiKey)
        break
      case "imagen":
        result = await AIImageService.generateWithImagen(prompt, apiKey)
        break
      case "llama":
        result = await AIImageService.generateWithLLaMA(prompt, apiKey)
        break
      default:
        return NextResponse.json({ error: "Unsupported AI model" }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      revisedPrompt: result.revisedPrompt,
    })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
