"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles } from "lucide-react"

interface AIImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void
}

export function AIImageGenerator({ onImageGenerated }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [aiModel, setAiModel] = useState("dall-e")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      // Simulate AI image generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // For demo purposes, using a placeholder image
      const imageUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(prompt)}`
      onImageGenerated(imageUrl)
    } catch (error) {
      console.error("Failed to generate image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg border border-purple-700/30">
      <div>
        <Label htmlFor="ai-model" className="text-purple-300">
          AI Model
        </Label>
        <Select value={aiModel} onValueChange={setAiModel}>
          <SelectTrigger className="bg-slate-700/50 border-purple-700/50 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dall-e">DALL-E 3</SelectItem>
            <SelectItem value="imagen">Google Imagen</SelectItem>
            <SelectItem value="llama">LLaMA Vision</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="prompt" className="text-purple-300">
          Image Prompt
        </Label>
        <Input
          id="prompt"
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400"
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Image
          </>
        )}
      </Button>
    </div>
  )
}
