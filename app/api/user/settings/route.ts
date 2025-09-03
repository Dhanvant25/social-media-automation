import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { pool } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userResult = await pool.query("SELECT id, name, email, settings FROM users WHERE email = $1", [
      session.user.email,
    ])

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userResult.rows[0]
    const defaultSettings = {
      name: user.name || "",
      email: user.email,
      timezone: "UTC",
      defaultScheduleTime: "09:00",
      notifications: {
        email: true,
        push: true,
        postSuccess: true,
        postFailure: true,
        weeklyReport: true,
      },
      preferences: {
        theme: "dark",
        autoSave: true,
        confirmDelete: true,
        showTips: true,
      },
    }

    const settings = user.settings ? { ...defaultSettings, ...user.settings } : defaultSettings

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body

    const result = await pool.query(
      `
      UPDATE users 
      SET name = $1, settings = $2, updated_at = NOW()
      WHERE email = $3
      RETURNING id
    `,
      [settings.name, JSON.stringify(settings), session.user.email],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
