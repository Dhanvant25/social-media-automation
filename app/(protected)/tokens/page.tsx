"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Key, Plus, Shield, Trash2 } from "lucide-react";
import { getPlatforms } from "@/lib/posts";
import { platform } from "os";

const apiTokens = [
  {
    id: "1",
    platform: "Twitter/X",
    tokenName: "Main Account",
    token: "xvz1evFS4wEEPTGEFPHBog...",
    isActive: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    platform: "Instagram",
    tokenName: "Business Profile",
    token: "IGQVJYeUhyYW9...",
    isActive: true,
    createdAt: new Date("2024-01-08"),
  },
  {
    id: "3",
    platform: "LinkedIn",
    tokenName: "Company Page",
    token: "AQXdSP_W0DHaoLiI5jjj...",
    isActive: false,
    createdAt: new Date("2024-01-05"),
  },
];

const aiProviders = [
  {
    id: "1",
    name: "OpenAI (DALL-E)",
    apiKey: "sk-proj-abc123...",
    isActive: true,
  },
  {
    id: "2",
    name: "Google Imagen",
    apiKey: "AIzaSyC-abc123...",
    isActive: true,
  },
  {
    id: "3",
    name: "Meta LLaMA",
    apiKey: "llama-abc123...",
    isActive: false,
  },
];

interface Platform {
  id: string;
  key: string;
  label: string;
}

export default function TokensPage() {
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [isAddingToken, setIsAddingToken] = useState(false);
  const [newToken, setNewToken] = useState({
    platform: "",
    tokenName: "",
    token: "",
  });
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");

  const toggleTokenVisibility = (id: string) => {
    setShowTokens((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToken = () => {
    // Handle adding new token
    // console.log("Adding token:", newToken);
    // setIsAddingToken(false);
    // setNewToken({ platform: "", tokenName: "", token: "" });

    const platformLogic = {
      instagram: {
        apiUrl: "https://www.instagram.com/oauth/authorize",
        clientId: process.env.NEXT_PUBLIC_IG_APP_ID ?? "",
        redirectUri: process.env.NEXT_PUBLIC_IG_REDIRECT_URI ?? "",
        scope:
          "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights",
        responseType: "code",
      },
      facebook: {
        apiUrl: "https://www.facebook.com/v23.0/dialog/oauth",
        clientId: process.env.NEXT_PUBLIC_APP_ID ?? "",
        redirectUri: process.env.NEXT_PUBLIC_FB_REDIRECT_URI ?? "",
        // scope: "instagram_basic,instagram_manage_insights,pages_show_list",
        scope: "pages_manage_posts,pages_read_engagement,pages_show_list",
        responseType: "code",
      },
    };

    const platformKey = platforms.find(
      (platform) => platform.id == selectedPlatform
    )?.key;
    const platform = platformLogic[platformKey as keyof typeof platformLogic];

    if (platform) {
      const params = new URLSearchParams({
        client_id: platform.clientId,
        redirect_uri: platform.redirectUri,
        scope: platform.scope,
        response_type: platform.responseType,
      });

      if (platformKey == "instagram") {
        params.set("force_reauth", "true");
      }

      window.location.href = `${platform.apiUrl}?${params.toString()}`;
    }
  };

  const fetchAllPlatforms = async () => {
    const res = await getPlatforms();

    if (res) {
      setPlatforms(res);
    }
  };

  useEffect(() => {
    fetchAllPlatforms();
  }, []);

  return (
    <div className="p-6 space-y-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex items-center justify-between col-span-1 lg:col-span-2">
        <div>
          <h1 className="text-3xl font-bold text-white">API Tokens</h1>
          <p className="text-purple-300">
            Manage your social media and AI service tokens
          </p>
        </div>
        <Dialog open={isAddingToken} onOpenChange={setIsAddingToken}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Token
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-purple-800/50">
            <DialogHeader>
              <DialogTitle className="text-white">
                Add New API Token
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform" className="text-purple-300">
                  Platform
                </Label>
                <Select
                  value={newToken.platform}
                  onValueChange={(value) => {
                    setNewToken((prev) => ({ ...prev, platform: value }));
                    setSelectedPlatform(value);
                  }}
                >
                  <SelectTrigger className="bg-slate-700/50 border-purple-700/50 text-white">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem> */}

                    {platforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(selectedPlatform == "1" || selectedPlatform == "3") && (
                <>
                  <div>
                    <Label htmlFor="tokenName" className="text-purple-300">
                      Token Name
                    </Label>
                    <Input
                      id="tokenName"
                      placeholder="e.g., Main Account"
                      value={newToken.tokenName}
                      onChange={(e) =>
                        setNewToken((prev) => ({
                          ...prev,
                          tokenName: e.target.value,
                        }))
                      }
                      className="bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="token" className="text-purple-300">
                      API Token
                    </Label>
                    <Input
                      id="token"
                      type="password"
                      placeholder="Paste your API token here"
                      value={newToken.token}
                      onChange={(e) =>
                        setNewToken((prev) => ({
                          ...prev,
                          token: e.target.value,
                        }))
                      }
                      className="bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400"
                    />
                  </div>
                </>
              )}
              <Button
                onClick={handleAddToken}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={
                  !selectedPlatform ||
                  ((selectedPlatform == "1" || selectedPlatform == "3") &&
                    (!newToken.tokenName || !newToken.token))
                }
              >
                Add Token
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Social Media Tokens */}
      <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Social Media Tokens</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiTokens.map((token) => (
            <div
              key={token.id}
              className="p-4 bg-slate-700/30 rounded-lg border border-purple-700/30 hover:border-purple-600/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-medium">{token.platform}</h3>
                    <Badge
                      variant={token.isActive ? "default" : "secondary"}
                      className={
                        token.isActive
                          ? "bg-green-500/20 text-green-300"
                          : "bg-gray-500/20 text-gray-300"
                      }
                    >
                      {token.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-purple-300 text-sm mb-2">
                    {token.tokenName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-slate-600/50 px-2 py-1 rounded text-purple-200">
                      {showTokens[token.id] ? token.token : "••••••••••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTokenVisibility(token.id)}
                      className="text-purple-300 hover:text-white"
                    >
                      {showTokens[token.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-purple-400 mt-2">
                    Added on {token.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Provider Tokens */}
      <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>AI Provider Keys</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiProviders.map((provider) => (
            <div
              key={provider.id}
              className="p-4 bg-slate-700/30 rounded-lg border border-purple-700/30 hover:border-purple-600/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-medium">{provider.name}</h3>
                    <Badge
                      variant={provider.isActive ? "default" : "secondary"}
                      className={
                        provider.isActive
                          ? "bg-green-500/20 text-green-300"
                          : "bg-gray-500/20 text-gray-300"
                      }
                    >
                      {provider.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-slate-600/50 px-2 py-1 rounded text-purple-200">
                      {showTokens[provider.id]
                        ? provider.apiKey
                        : "••••••••••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTokenVisibility(provider.id)}
                      className="text-purple-300 hover:text-white"
                    >
                      {showTokens[provider.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
