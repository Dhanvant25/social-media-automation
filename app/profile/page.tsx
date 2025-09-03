"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Lock, Eye, EyeOff, Save, RefreshCw, Shield, Camera, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Profile form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    }
  }

  const passwordValidation = validatePassword(newPassword)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await updateProfile({ name, email })

    if (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
    }

    setLoading(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match",
        variant: "destructive",
      })
      setPasswordLoading(false)
      return
    }

    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid Password",
        description: "Password does not meet requirements",
        variant: "destructive",
      })
      setPasswordLoading(false)
      return
    }

    const { error } = await updatePassword(newPassword)

    if (error) {
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully",
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }

    setPasswordLoading(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-purple-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-purple-300">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl">
                    {getInitials(user.user_metadata?.name || user.email || "U")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">{user.user_metadata?.name || "User"}</h3>
                <p className="text-purple-300">{user.email}</p>
              </div>

              <div className="flex items-center justify-center space-x-2">
                {user.email_confirmed_at ? (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Unverified
                  </Badge>
                )}
              </div>

              <Separator className="bg-purple-800/30" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-purple-300">
                  <span>Member since:</span>
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-purple-300">
                  <span>Last sign in:</span>
                  <span>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-slate-800/50 border-purple-800/50">
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-purple-600">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-purple-300">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-purple-300">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400"
                          placeholder="Enter your email"
                        />
                      </div>
                      <p className="text-xs text-purple-400">Changing your email will require verification</p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-purple-300">
                        New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10 pr-10 bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Password Requirements */}
                      {newPassword && (
                        <div className="space-y-1 text-xs">
                          <div
                            className={`flex items-center space-x-2 ${passwordValidation.minLength ? "text-green-400" : "text-red-400"}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? "bg-green-400" : "bg-red-400"}`}
                            />
                            <span>At least 8 characters</span>
                          </div>
                          <div
                            className={`flex items-center space-x-2 ${passwordValidation.hasUpper ? "text-green-400" : "text-red-400"}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${passwordValidation.hasUpper ? "bg-green-400" : "bg-red-400"}`}
                            />
                            <span>One uppercase letter</span>
                          </div>
                          <div
                            className={`flex items-center space-x-2 ${passwordValidation.hasLower ? "text-green-400" : "text-red-400"}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${passwordValidation.hasLower ? "bg-green-400" : "bg-red-400"}`}
                            />
                            <span>One lowercase letter</span>
                          </div>
                          <div
                            className={`flex items-center space-x-2 ${passwordValidation.hasNumber ? "text-green-400" : "text-red-400"}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? "bg-green-400" : "bg-red-400"}`}
                            />
                            <span>One number</span>
                          </div>
                          <div
                            className={`flex items-center space-x-2 ${passwordValidation.hasSpecial ? "text-green-400" : "text-red-400"}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${passwordValidation.hasSpecial ? "bg-green-400" : "bg-red-400"}`}
                            />
                            <span>One special character</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-purple-300">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10 bg-slate-700/50 border-purple-700/50 text-white placeholder:text-purple-400"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-red-400">Passwords do not match</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={passwordLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {passwordLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Email Verification</h4>
                      <p className="text-sm text-purple-300">
                        {user.email_confirmed_at ? "Your email is verified" : "Please verify your email address"}
                      </p>
                    </div>
                    {user.email_confirmed_at ? (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-600 text-purple-300 hover:bg-purple-600/20 bg-transparent"
                      >
                        Verify Email
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-purple-300">Add an extra layer of security to your account</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-600 text-purple-300 hover:bg-purple-600/20 bg-transparent"
                    >
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Login Sessions</h4>
                      <p className="text-sm text-purple-300">Manage your active login sessions</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-600 text-purple-300 hover:bg-purple-600/20 bg-transparent"
                    >
                      View Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
