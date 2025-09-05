"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { getPlatforms } from "@/lib/posts";

const platformIcons = [
  { id: "twitter", name: "Twitter/X", icon: Twitter, color: "text-blue-400" },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-400",
  },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-500" },
];

const platformIconsMap = {
  twitter: { icon: Twitter, color: "text-blue-400" },
  instagram: { icon: Instagram, color: "text-pink-400" },
  linkedin: { icon: Linkedin, color: "text-blue-600" },
  facebook: { icon: Facebook, color: "text-blue-500" },
};

interface PlatformSelectorProps {
  selected: string[];
  onChange: (platforms: string[]) => void;
}

interface Platform {
  id: string;
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function PlatformSelector({
  selected,
  onChange,
}: PlatformSelectorProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  const handleToggle = (platformId: string) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter((id) => id !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  const fetchPlatforms = async () => {
    setLoading(true);
    const res = await getPlatforms();
    setLoading(false);

    if (res) {
      const updatedPlatforms = res.map((platform) => {
        const platformIcon =
          platformIconsMap[platform.key as keyof typeof platformIconsMap];

        if (platformIcon) {
          return {
            ...platform,
            icon: platformIcon.icon,
            color: platformIcon.color,
          };
        }
        return platform;
      });

      setPlatforms(updatedPlatforms);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  return (
    <div>
      <Label className="text-purple-300 mb-3 block">Select Platforms</Label>
      <div className="grid grid-cols-2 gap-3">
        {loading ? (
          <div className="flex items-center justify-center">Loading...</div>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => (
              <li
                key={platform.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 border border-purple-700/30 hover:border-purple-600/50 transition-colors"
              >
                <Checkbox
                  id={platform.id}
                  checked={selected.includes(platform.id)}
                  onCheckedChange={() => handleToggle(platform.id)}
                />
                <platform.icon className={`h-5 w-5 ${platform.color}`} />
                <Label
                  htmlFor={platform.id}
                  className="text-white text-sm cursor-pointer"
                >
                  {platform.label}
                </Label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
