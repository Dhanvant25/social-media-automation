"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";
import { Sparkles, Send } from "lucide-react";
import { PlatformSelector } from "./platform-selector";
import { AIImageGenerator } from "./ai-image-generator";
import { DateTimePicker } from "./date-time-picker";
import { toast } from "@/components/ui/use-toast";
import { getTags, getPlatforms, getPosts, createPost } from "@/lib/posts";
import { useAuth } from "@/lib/auth-context";

interface Tag {
  id: number;
  name: string;
  created_at?: string;
}

export function PostCreator() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState<Date>();
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>();
  interface Tag {
    id: number;
    name: string;
    created_at?: string;
  }

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Check for selected AI image from studio
    const selectedImage = localStorage.getItem("selectedAIImage");
    if (selectedImage) {
      try {
        const imageData = JSON.parse(selectedImage);
        setGeneratedImage(imageData.url);
        localStorage.removeItem("selectedAIImage"); // Clean up
        toast({
          title: "Image Loaded",
          description: "AI generated image loaded from studio",
        });
      } catch (error) {
        console.error("Failed to load selected image:", error);
      }
    }

    fetchPosts();
    fetchTags();
  }, []);

  const fetchPosts = async () => {
    const posts = await getPosts();
    console.log("Posts:", posts);
  };

  const fetchTags = async () => {
    const tags = await getTags();

    if (tags) {
      setTags(tags);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use current time if no scheduled time is set
      const postScheduledTime = scheduledTime || new Date();
      const tagIds = selectedTags.map((tag) => tag.id);

      console.log({
        content,
        platforms: selectedPlatforms.join(","),
        scheduledTime: postScheduledTime,
        tags: tagIds.join(","),
        imageUrl: generatedImage,
      });

      const post = await createPost(
        content,
        selectedPlatforms.join(","),
        postScheduledTime,
        generatedImage || "",
        user.id,
        tagIds.join(",")
      );

      if (post) {
        toast({
          title: "Success",
          description: "Post created successfully!",
        });

        // Reset form
        setContent("");
        setSelectedPlatforms([]);
        setSelectedTags([]);
        setScheduledTime(undefined);
        setGeneratedImage(undefined);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <div className="text-xs text-purple-400 mt-1">
            {content.length}/280 characters
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-purple-300">
            Tags
          </Label>
          <MultiSelect
            id="tags"
            placeholder="Select tags"
            value={selectedTags}
            onValueChange={setSelectedTags}
            options={tags}
            creatable
            className="bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400"
          />
          <p className="text-xs text-muted-foreground">
            Type and press Enter to add new tags
          </p>
        </div>

        <PlatformSelector
          selected={selectedPlatforms}
          onChange={setSelectedPlatforms}
        />

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

          {showAIGenerator && (
            <AIImageGenerator onImageGenerated={setGeneratedImage} />
          )}

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
          disabled={
            !content || selectedPlatforms.length === 0 || !scheduledTime
          }
        >
          <Send className="h-4 w-4 mr-2" />
          Schedule Post
        </Button>
      </CardContent>
    </Card>
  );
}
