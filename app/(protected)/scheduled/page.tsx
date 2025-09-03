"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Filter, Search, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const scheduledPosts = [
  {
    id: "1",
    content: "Exciting news about our AI platform launch! 🚀 Join us for the live demo tomorrow.",
    platforms: ["twitter", "linkedin", "facebook"],
    scheduledTime: new Date("2024-01-20T14:00:00"),
    status: "pending" as const,
    imageUrl: "/placeholder.svg?height=200&width=300&text=AI+Launch",
  },
  {
    id: "2",
    content: "Weekly tech roundup: The latest in AI and automation 📱",
    platforms: ["instagram", "twitter"],
    scheduledTime: new Date("2024-01-18T09:00:00"),
    status: "pending" as const,
  },
  {
    id: "3",
    content: "Customer success story: How automation saved 10 hours per week ⏰",
    platforms: ["linkedin"],
    scheduledTime: new Date("2024-01-16T11:30:00"),
    status: "posted" as const,
    imageUrl: "/placeholder.svg?height=200&width=300&text=Success+Story",
  },
]

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  posted: "bg-green-500/20 text-green-300 border-green-500/30",
  failed: "bg-red-500/20 text-red-300 border-red-500/30",
}

export default function ScheduledPosts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Scheduled Posts</h1>
          <p className="text-purple-300">Manage your scheduled social media posts</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-slate-700/50 border-purple-700/50 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full md:w-40 bg-slate-700/50 border-purple-700/50 text-white">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {scheduledPosts.map((post) => (
          <Card key={post.id} className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {post.imageUrl && (
                  <div className="lg:w-48 flex-shrink-0">
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt="Post image"
                      className="w-full h-32 lg:h-24 object-cover rounded-lg border border-purple-600/30"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <p className="text-white text-lg leading-relaxed">{post.content}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.platforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant="outline"
                        className="border-purple-600/50 text-purple-300 capitalize"
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className={statusColors[post.status]}>{post.status}</Badge>
                      <div className="flex items-center text-purple-300 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {post.scheduledTime.toLocaleString()}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Post
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
