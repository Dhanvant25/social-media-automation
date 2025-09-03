"use client"
import { PostCreator } from "@/components/post-creator"
import { RecentPosts } from "@/components/recent-posts"
import { StatsCards } from "@/components/stats-cards"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-purple-300">Create and schedule your social media posts</p>
        </div>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PostCreator />
        <RecentPosts />
      </div>
    </div>
  )
}
