"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Palette, Database, Key, Trash2, Save, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UserSettings {
  name: string
  email: string
  timezone: string
  defaultScheduleTime: string
  notifications: {
    email: boolean
    push: boolean
    postSuccess: boolean
    postFailure: boolean
    weeklyReport: boolean
  }
  preferences: {
    theme: string
    autoSave: boolean
    confirmDelete: boolean
    showTips: boolean
  }
}

interface SystemStats {
  totalPosts: number
  successfulPosts: number
  failedPosts: number
  totalImages: number
  storageUsed: string
  apiCallsThisMonth: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    timezone: "UTC",
    defaultScheduleTime: "09:00",
    notifications: {
      email: true,
      push: true,
      postSuccess: true,
      postFailure: true,
      weeklyReport: true,
    },
    preferences: {
      theme: "dark",
      autoSave: true,
      confirmDelete: true,
      showTips: true,
    },
  })

  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalPosts: 0,
    successfulPosts: 0,
    failedPosts: 0,
    totalImages: 0,
    storageUsed: "0 MB",
    apiCallsThisMonth: 0,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    loadSettings()
    loadSystemStats()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/user/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  const loadSystemStats = async () => {
    try {
      const response = await fetch("/api/user/stats")
      if (response.ok) {
        const data = await response.json()
        setSystemStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to load system stats:", error)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      })

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Your settings have been updated successfully",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetData = async () => {
    if (!confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      return
    }

    setIsResetting(true)
    try {
      const response = await fetch("/api/user/reset", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Data Reset",
          description: "All your data has been reset successfully",
        })
        loadSystemStats()
      } else {
        throw new Error("Failed to reset data")
      }
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-purple-300">Manage your account and application preferences</p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-800/50 border-purple-800/50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-600">
            <Palette className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-purple-600">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-purple-600">
            <Database className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-purple-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700/50 border-purple-700/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-purple-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-slate-700/50 border-purple-700/50 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Scheduling Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone" className="text-purple-300">
                    Timezone
                  </Label>
                  <select
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => setSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                    className="w-full p-2 bg-slate-700/50 border border-purple-700/50 rounded-md text-white"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="defaultTime" className="text-purple-300">
                    Default Schedule Time
                  </Label>
                  <Input
                    id="defaultTime"
                    type="time"
                    value={settings.defaultScheduleTime}
                    onChange={(e) => setSettings((prev) => ({ ...prev, defaultScheduleTime: e.target.value }))}
                    className="bg-slate-700/50 border-purple-700/50 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-purple-300">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked },
                      }))
                    }
                  />
                </div>

                <Separator className="bg-purple-800/30" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Push Notifications</Label>
                    <p className="text-sm text-purple-300">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked },
                      }))
                    }
                  />
                </div>

                <Separator className="bg-purple-800/30" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Post Success Notifications</Label>
                    <p className="text-sm text-purple-300">Get notified when posts are published successfully</p>
                  </div>
                  <Switch
                    checked={settings.notifications.postSuccess}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, postSuccess: checked },
                      }))
                    }
                  />
                </div>

                <Separator className="bg-purple-800/30" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Post Failure Notifications</Label>
                    <p className="text-sm text-purple-300">Get notified when posts fail to publish</p>
                  </div>
                  <Switch
                    checked={settings.notifications.postFailure}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, postFailure: checked },
                      }))
                    }
                  />
                </div>

                <Separator className="bg-purple-800/30" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Weekly Reports</Label>
                    <p className="text-sm text-purple-300">Receive weekly performance reports</p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyReport}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, weeklyReport: checked },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Application Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Auto-save Drafts</Label>
                    <p className="text-sm text-purple-300">Automatically save post drafts as you type</p>
                  </div>
                  <Switch
                    checked={settings.preferences.autoSave}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        preferences: { ...prev.preferences, autoSave: checked },
                      }))
                    }
                  />
                </div>

                <Separator className="bg-purple-800/30" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Confirm Deletions</Label>
                    <p className="text-sm text-purple-300">Show confirmation dialog before deleting items</p>
                  </div>
                  <Switch
                    checked={settings.preferences.confirmDelete}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        preferences: { ...prev.preferences, confirmDelete: checked },
                      }))
                    }
                  />
                </div>

                <Separator className="bg-purple-800/30" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Show Tips</Label>
                    <p className="text-sm text-purple-300">Display helpful tips and tutorials</p>
                  </div>
                  <Switch
                    checked={settings.preferences.showTips}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        preferences: { ...prev.preferences, showTips: checked },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">API Key Security</Label>
                  <p className="text-sm text-purple-300 mb-2">
                    All API keys are encrypted using AES-256-GCM encryption
                  </p>
                  <Badge variant="outline" className="border-green-600/50 text-green-300">
                    <Shield className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                </div>

                <Separator className="bg-purple-800/30" />

                <div>
                  <Label className="text-white">Session Management</Label>
                  <p className="text-sm text-purple-300 mb-2">Your session is secured with NextAuth.js</p>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-600/20 bg-transparent"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Manage Sessions
                  </Button>
                </div>

                <Separator className="bg-purple-800/30" />

                <div>
                  <Label className="text-white">Two-Factor Authentication</Label>
                  <p className="text-sm text-purple-300 mb-2">Add an extra layer of security to your account</p>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-600/20 bg-transparent"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">System Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{systemStats.totalPosts}</div>
                  <div className="text-sm text-purple-300">Total Posts</div>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{systemStats.successfulPosts}</div>
                  <div className="text-sm text-purple-300">Successful Posts</div>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">{systemStats.failedPosts}</div>
                  <div className="text-sm text-purple-300">Failed Posts</div>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{systemStats.totalImages}</div>
                  <div className="text-sm text-purple-300">Generated Images</div>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{systemStats.storageUsed}</div>
                  <div className="text-sm text-purple-300">Storage Used</div>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{systemStats.apiCallsThisMonth}</div>
                  <div className="text-sm text-purple-300">API Calls This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Export Data</Label>
                  <p className="text-sm text-purple-300 mb-2">Download all your data in JSON format</p>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-600/20 bg-transparent"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <Separator className="bg-purple-800/30" />

                <div>
                  <Label className="text-white">Reset All Data</Label>
                  <p className="text-sm text-purple-300 mb-2">
                    Permanently delete all posts, images, and settings. This action cannot be undone.
                  </p>
                  <Button
                    onClick={handleResetData}
                    disabled={isResetting}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reset All Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
