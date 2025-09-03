"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const recentPosts = [
  {
    id: "1",
    content: "Just launched our new AI-powered social media tool! 🚀 #AI #SocialMedia",
    platforms: ["twitter", "linkedin"],
    scheduledTime: new Date("2024-01-15T10:00:00"),
    status: "pending" as const,
    imageUrl: "/placeholder.svg?height=100&width=100&text=AI+Tool",
  },
  {
    id: "2",
    content: "Behind the scenes of building our automation platform 💻",
    platforms: ["instagram", "facebook"],
    scheduledTime: new Date("2024-01-14T15:30:00"),
    status: "posted" as const,
  },
  {
    id: "3",
    content: "Tips for effective social media automation 📈",
    platforms: ["twitter", "linkedin", "facebook"],
    scheduledTime: new Date("2024-01-13T09:00:00"),
    status: "failed" as const,
  },
]

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  posted: "bg-green-500/20 text-green-300 border-green-500/30",
  failed: "bg-red-500/20 text-red-300 border-red-500/30",
}

export function RecentPosts() {
  return (
    <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Recent Posts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-slate-700/30 rounded-lg border border-purple-700/30 hover:border-purple-600/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-white text-sm mb-2 line-clamp-2">{post.content}</p>
                <div className="flex items-center space-x-2 mb-2">
                  {post.platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs border-purple-600/50 text-purple-300">
                      {platform}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={statusColors[post.status]}>{post.status}</Badge>
                  <span className="text-xs text-purple-400">{post.scheduledTime.toLocaleDateString()}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {post.imageUrl && (
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt="Post image"
                className="w-full h-32 object-cover rounded border border-purple-600/30"
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
