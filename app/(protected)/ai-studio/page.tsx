"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Sparkles, Download, Copy, Trash2, Loader2, Settings, Eye, Share } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  aiModel: string
  createdAt: Date
  revisedPrompt?: string
}

interface AIProvider {
  id: string
  name: string
  model: string
  isActive: boolean
  hasApiKey: boolean
}

export default function AIStudioPage() {
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("dall-e")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [aiProviders, setAiProviders] = useState<AIProvider[]>([])
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)

  // Load AI providers and generated images on mount
  useEffect(() => {
    loadAIProviders()
    loadGeneratedImages()
  }, [])

  const loadAIProviders = async () => {
    try {
      const response = await fetch("/api/ai/providers")
      const data = await response.json()
      setAiProviders(data.providers || [])
    } catch (error) {
      console.error("Failed to load AI providers:", error)
    }
  }

  const loadGeneratedImages = async () => {
    try {
      const response = await fetch("/api/ai/images")
      const data = await response.json()
      setGeneratedImages(data.images || [])
    } catch (error) {
      console.error("Failed to load generated images:", error)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for image generation",
        variant: "destructive",
      })
      return
    }

    const provider = aiProviders.find((p) => p.model === selectedModel)
    if (!provider?.hasApiKey) {
      toast({
        title: "API Key Required",
        description: `Please configure your ${provider?.name} API key in settings`,
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          aiModel: selectedModel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        imageUrl: data.imageUrl,
        aiModel: selectedModel,
        createdAt: new Date(),
        revisedPrompt: data.revisedPrompt,
      }

      setGeneratedImages((prev) => [newImage, ...prev])

      toast({
        title: "Success",
        description: "Image generated successfully!",
      })

      // Clear prompt after successful generation
      setPrompt("")
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-generated-${image.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image",
        variant: "destructive",
      })
    }
  }

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard",
    })
  }

  const handleDeleteImage = (imageId: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId))
    toast({
      title: "Deleted",
      description: "Image removed from gallery",
    })
  }

  const handleUseInPost = (image: GeneratedImage) => {
    // Store image data in localStorage for use in post creator
    localStorage.setItem(
      "selectedAIImage",
      JSON.stringify({
        url: image.imageUrl,
        prompt: image.prompt,
        model: image.aiModel,
      }),
    )

    toast({
      title: "Image Selected",
      description: "Image ready to use in post creator",
    })

    // Navigate to dashboard
    window.location.href = "/"
  }

  const promptSuggestions = [
    "A futuristic cityscape at sunset with flying cars",
    "Abstract digital art with vibrant colors and geometric shapes",
    "A serene mountain landscape with a crystal clear lake",
    "Modern minimalist office space with natural lighting",
    "Cyberpunk street scene with neon lights and rain",
    "Elegant product photography of a luxury watch",
    "Cozy coffee shop interior with warm lighting",
    "Space exploration scene with astronauts and alien planets",
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Image Studio</h1>
          <p className="text-purple-300">Generate stunning images with AI for your social media posts</p>
        </div>
        <Button
          onClick={() => setIsConfiguring(true)}
          variant="outline"
          className="border-purple-600 text-purple-300 hover:bg-purple-600/20"
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure AI Providers
        </Button>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="bg-slate-800/50 border-purple-800/50">
          <TabsTrigger value="generate" className="data-[state=active]:bg-purple-600">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="gallery" className="data-[state=active]:bg-purple-600">
            <ImageIcon className="h-4 w-4 mr-2" />
            Gallery ({generatedImages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* AI Provider Status */}
          <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg">AI Providers Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { model: "dall-e", name: "DALL-E 3", description: "OpenAI's latest image model" },
                  { model: "imagen", name: "Google Imagen", description: "Google's advanced AI imagery" },
                  { model: "llama", name: "LLaMA Vision", description: "Meta's open-source model" },
                ].map((provider) => {
                  const configuredProvider = aiProviders.find((p) => p.model === provider.model)
                  const isConfigured = configuredProvider?.hasApiKey || false

                  return (
                    <div key={provider.model} className="p-4 bg-slate-700/30 rounded-lg border border-purple-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{provider.name}</h3>
                        <Badge
                          variant={isConfigured ? "default" : "secondary"}
                          className={isConfigured ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}
                        >
                          {isConfigured ? "Ready" : "Not Configured"}
                        </Badge>
                      </div>
                      <p className="text-purple-300 text-sm">{provider.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Image Generation */}
          <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Generate New Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ai-model" className="text-purple-300">
                  AI Model
                </Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-slate-700/50 border-purple-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dall-e">DALL-E 3 (OpenAI)</SelectItem>
                    <SelectItem value="imagen">Google Imagen</SelectItem>
                    <SelectItem value="llama">LLaMA Vision (Meta)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prompt" className="text-purple-300">
                  Image Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate in detail..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400 min-h-[100px]"
                />
                <div className="text-xs text-purple-400 mt-1">{prompt.length}/1000 characters</div>
              </div>

              {/* Prompt Suggestions */}
              <div>
                <Label className="text-purple-300 text-sm">Quick Suggestions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {promptSuggestions.slice(0, 4).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(suggestion)}
                      className="border-purple-600/50 text-purple-300 hover:bg-purple-600/20 text-xs"
                    >
                      {suggestion.slice(0, 30)}...
                    </Button>
                  ))}
                </div>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          {generatedImages.length === 0 ? (
            <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <ImageIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Images Generated Yet</h3>
                <p className="text-purple-300 mb-4">Start creating amazing AI-generated images for your posts</p>
                <Button
                  onClick={() => {
                    const generateButton = document.querySelector('[value="generate"]') as HTMLButtonElement;
                    if (generateButton) {
                      generateButton.click();
                    }
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Your First Image
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image) => (
                <Card key={image.id} className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm overflow-hidden">
                  <div className="relative group">
                    <img
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedImage(image)}
                        className="bg-white/20 hover:bg-white/30"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleDownload(image)} className="bg-white/20 hover:bg-white/30">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUseInPost(image)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="border-purple-600/50 text-purple-300">
                        {image.aiModel.toUpperCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteImage(image.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-white text-sm mb-2 line-clamp-2">{image.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-purple-400">
                      <span>{image.createdAt.toLocaleDateString()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyPrompt(image.prompt)}
                        className="text-purple-300 hover:text-white p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Preview Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="bg-slate-800 border-purple-800/50 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-white">Image Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={selectedImage.imageUrl || "/placeholder.svg"}
                alt={selectedImage.prompt}
                className="w-full max-h-96 object-contain rounded-lg"
              />
              <div className="space-y-2">
                <div>
                  <Label className="text-purple-300">Original Prompt:</Label>
                  <p className="text-white text-sm bg-slate-700/50 p-2 rounded">{selectedImage.prompt}</p>
                </div>
                {selectedImage.revisedPrompt && (
                  <div>
                    <Label className="text-purple-300">AI Revised Prompt:</Label>
                    <p className="text-white text-sm bg-slate-700/50 p-2 rounded">{selectedImage.revisedPrompt}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-purple-600/50 text-purple-300">
                    {selectedImage.aiModel.toUpperCase()}
                  </Badge>
                  <span className="text-purple-400 text-sm">{selectedImage.createdAt.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleUseInPost(selectedImage)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Use in Post
                </Button>
                <Button
                  onClick={() => handleDownload(selectedImage)}
                  variant="outline"
                  className="border-purple-600 text-purple-300 hover:bg-purple-600/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => handleCopyPrompt(selectedImage.prompt)}
                  variant="outline"
                  className="border-purple-600 text-purple-300 hover:bg-purple-600/20"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Prompt
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
