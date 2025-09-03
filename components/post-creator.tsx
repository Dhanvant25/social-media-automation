"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Send } from "lucide-react"
import { PlatformSelector } from "./platform-selector"
import { AIImageGenerator } from "./ai-image-generator"
import { DateTimePicker } from "./date-time-picker"
import { toast } from "@/components/ui/use-toast"

export function PostCreator() {
  const [content, setContent] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduledTime, setScheduledTime] = useState<Date>()
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string>()

  useEffect(() => {
    // Check for selected AI image from studio
    const selectedImage = localStorage.getItem("selectedAIImage")
    if (selectedImage) {
      try {
        const imageData = JSON.parse(selectedImage)
        setGeneratedImage(imageData.url)
        localStorage.removeItem("selectedAIImage") // Clean up
        toast({
          title: "Image Loaded",
          description: "AI generated image loaded from studio",
        })
      } catch (error) {
        console.error("Failed to load selected image:", error)
      }
    }
  }, [])

  const handleSubmit = async () => {
    // Handle post creation logic here
    console.log({
      content,
      platforms: selectedPlatforms,
      scheduledTime,
      imageUrl: generatedImage,
    })
  }

  return (
    <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Send className="h-5 w-5" />
          <span>Create New Post</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="content" className="text-purple-300">
            Post Content
          </Label>
          <Textarea
            id="content"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400 min-h-[100px]"
          />
          <div className="text-xs text-purple-400 mt-1">{content.length}/280 characters</div>
        </div>

        <PlatformSelector selected={selectedPlatforms} onChange={setSelectedPlatforms} />

        <DateTimePicker value={scheduledTime} onChange={setScheduledTime} />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-purple-300">AI Image Generation</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIGenerator(!showAIGenerator)}
              className="border-purple-600 text-purple-300 hover:bg-purple-600/20"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showAIGenerator ? "Hide" : "Generate Image"}
            </Button>
          </div>

          {showAIGenerator && <AIImageGenerator onImageGenerated={setGeneratedImage} />}

          {generatedImage && (
            <div className="relative">
              <img
                src={generatedImage || "/placeholder.svg"}
                alt="Generated"
                className="w-full h-48 object-cover rounded-lg border border-purple-600/50"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setGeneratedImage(undefined)}
                className="absolute top-2 right-2"
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={!content || selectedPlatforms.length === 0}
        >
          <Send className="h-4 w-4 mr-2" />
          Schedule Post
        </Button>
      </CardContent>
    </Card>
  )
}
