"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

const platforms = [
  { id: "twitter", name: "Twitter/X", icon: Twitter, color: "text-blue-400" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-400" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-500" },
]

interface PlatformSelectorProps {
  selected: string[]
  onChange: (platforms: string[]) => void
}

export function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  const handleToggle = (platformId: string) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter((id) => id !== platformId))
    } else {
      onChange([...selected, platformId])
    }
  }

  return (
    <div>
      <Label className="text-purple-300 mb-3 block">Select Platforms</Label>
      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 border border-purple-700/30 hover:border-purple-600/50 transition-colors"
          >
            <Checkbox
              id={platform.id}
              checked={selected.includes(platform.id)}
              onCheckedChange={() => handleToggle(platform.id)}
            />
            <platform.icon className={`h-5 w-5 ${platform.color}`} />
            <Label htmlFor={platform.id} className="text-white text-sm cursor-pointer">
              {platform.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
