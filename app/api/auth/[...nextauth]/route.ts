import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { pool } from "@/lib/db"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [user.email])

          if (existingUser.rows.length === 0) {
            // Create new user
            await pool.query("INSERT INTO users (email, name) VALUES ($1, $2)", [user.email, user.name])
          }
          return true
        } catch (error) {
          console.error("Error during sign in:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }
