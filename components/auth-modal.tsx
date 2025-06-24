"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (userData: { email: string; role: string; name: string }) => void
}

interface StoredUser {
  name: string
  email: string
  password: string
  role: string
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("signin")
  const [selectedRole, setSelectedRole] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    {
      id: "event-planner",
      title: "Event Planner",
      description: "Find and book talented artists for your events",
      features: ["Browse artist profiles", "Request quotes", "Manage bookings", "Event planning tools"],
      icon: Calendar,
    },
    {
      id: "artist-manager",
      title: "Artist Manager",
      description: "Manage artists and receive booking opportunities",
      features: ["Artist dashboard", "Booking management", "Lead tracking", "Performance analytics"],
      icon: Users,
    },
  ]

  // Get stored users from localStorage
  const getStoredUsers = (): StoredUser[] => {
    const users = localStorage.getItem("artistly_users")
    return users ? JSON.parse(users) : []
  }

  // Save user to localStorage
  const saveUser = (user: StoredUser) => {
    const users = getStoredUsers()
    const existingUserIndex = users.findIndex((u) => u.email === user.email)

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user
    } else {
      users.push(user)
    }

    localStorage.setItem("artistly_users", JSON.stringify(users))
  }

  // Check if user exists
  const findUser = (email: string): StoredUser | null => {
    const users = getStoredUsers()
    return users.find((user) => user.email === email) || null
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (activeTab === "signup") {
      if (!formData.name) {
        newErrors.name = "Name is required"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
      if (!selectedRole) {
        newErrors.role = "Please select your role"
      }

      // Check if user already exists
      const existingUser = findUser(formData.email)
      if (existingUser) {
        newErrors.email = "An account with this email already exists. Please sign in instead."
      }
    }

    if (activeTab === "signin") {
      // Check if user exists
      const existingUser = findUser(formData.email)
      if (!existingUser) {
        newErrors.email = "No account found with this email. Please sign up first."
      } else if (existingUser.password !== formData.password) {
        newErrors.password = "Incorrect password"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (activeTab === "signup") {
        // Create new user
        const newUser: StoredUser = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        }

        saveUser(newUser)

        const userData = {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }

        // Store current session
        localStorage.setItem("artistly_user", JSON.stringify(userData))
        localStorage.setItem("artistly_auth_token", "mock_token_" + Date.now())

        // Call the success handler immediately to update parent components
        onAuthSuccess(userData)
      } else {
        // Sign in existing user
        const existingUser = findUser(formData.email)
        if (existingUser) {
          const userData = {
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
          }

          // Store current session
          localStorage.setItem("artistly_user", JSON.stringify(userData))
          localStorage.setItem("artistly_auth_token", "mock_token_" + Date.now())

          // Call the success handler immediately to update parent components
          onAuthSuccess(userData)
        }
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      setSelectedRole("")

      // Close modal after successful authentication
      onClose()
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setErrors({}) // Clear errors when switching tabs
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setSelectedRole("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Artistly</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sign In to Your Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div>
                    <Label className="text-base font-medium">Choose Your Role</Label>
                    <p className="text-sm text-gray-600 mb-4">Select how you want to use Artistly</p>

                    <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="space-y-4">
                      {roles.map((role) => (
                        <div key={role.id} className="flex items-start space-x-3">
                          <RadioGroupItem value={role.id} id={role.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={role.id} className="cursor-pointer">
                              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center mb-2">
                                  <role.icon className="h-5 w-5 text-purple-600 mr-2" />
                                  <h3 className="font-semibold">{role.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {role.features.map((feature, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
