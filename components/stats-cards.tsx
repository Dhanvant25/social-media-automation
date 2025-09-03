"use client"

import { Calendar, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Posts",
    value: "24",
    change: "+12%",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Scheduled",
    value: "8",
    change: "+3",
    icon: Clock,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Published",
    value: "16",
    change: "+8",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "This Week",
    value: "12",
    change: "+4",
    icon: Calendar,
    color: "from-orange-500 to-red-500",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">{stat.title}</CardTitle>
            <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="text-xs text-green-400">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
