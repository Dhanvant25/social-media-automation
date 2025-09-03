export interface SocialPost {
  id: string
  content: string
  platforms: string[]
  scheduledTime: Date
  status: "pending" | "posted" | "failed"
  imageUrl?: string
  imagePrompt?: string
  aiModel?: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiToken {
  id: string
  platform: string
  tokenName: string
  token: string
  isActive: boolean
  createdAt: Date
}

export interface AIProvider {
  id: string
  name: string
  apiKey: string
  isActive: boolean
}

export type Platform = "twitter" | "instagram" | "linkedin" | "facebook"
export type AIModel = "dall-e" | "imagen" | "llama"
