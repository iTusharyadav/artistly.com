"use client"

import { useState, useEffect } from "react"
import { Table } from "@/components/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Calendar, DollarSign, TrendingUp, Plus, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import artistsData from "@/data/artists.json"

export default function DashboardPage() {
  const [artists, setArtists] = useState(artistsData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and has the right role
    const storedUser = localStorage.getItem("artistly_user")
    if (!storedUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(storedUser)
    if (userData.role !== "artist-manager") {
      router.push("/")
      return
    }

    setUser(userData)
  }, [router])

  const [newArtist, setNewArtist] = useState({
    name: "",
    category: "",
    bio: "",
    location: "",
    priceRange: "",
  })

  const stats = [
    {
      title: "Total Artists",
      value: artists.length,
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Active Bookings",
      value: 24,
      icon: Calendar,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Revenue This Month",
      value: "$12,450",
      icon: DollarSign,
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      icon: TrendingUp,
      change: "+0.2",
      changeType: "positive" as const,
    },
  ]

  const recentBookings = [
    {
      id: 1,
      artist: "Sarah Johnson",
      event: "Wedding Reception",
      date: "2024-01-15",
      status: "confirmed",
      amount: "$850",
    },
    {
      id: 2,
      artist: "DJ Mike Rodriguez",
      event: "Corporate Party",
      date: "2024-01-18",
      status: "pending",
      amount: "$1,200",
    },
    {
      id: 3,
      artist: "Elena Petrov",
      event: "Art Gallery Opening",
      date: "2024-01-20",
      status: "confirmed",
      amount: "$600",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddArtist = () => {
    if (!newArtist.name || !newArtist.category || !newArtist.bio || !newArtist.location || !newArtist.priceRange) {
      alert("Please fill in all fields")
      return
    }

    const artistToAdd = {
      id: artists.length + 1,
      name: newArtist.name,
      category: newArtist.category,
      bio: newArtist.bio,
      priceRange: newArtist.priceRange,
      location: newArtist.location,
      languages: ["English"],
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.5,
      reviewCount: 0,
    }

    setArtists([...artists, artistToAdd])
    setNewArtist({
      name: "",
      category: "",
      bio: "",
      location: "",
      priceRange: "",
    })
    setIsAddModalOpen(false)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
          <p className="text-gray-600">Manage your artists and track performance</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add New Artist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Artist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="artist-name">Artist Name</Label>
                <Input
                  id="artist-name"
                  value={newArtist.name}
                  onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                  placeholder="Enter artist name"
                />
              </div>

              <div>
                <Label htmlFor="artist-category">Category</Label>
                <Select
                  value={newArtist.category}
                  onValueChange={(value) => setNewArtist({ ...newArtist, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="singers">Singer</SelectItem>
                    <SelectItem value="djs">DJ</SelectItem>
                    <SelectItem value="dancers">Dancer</SelectItem>
                    <SelectItem value="speakers">Speaker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="artist-bio">Bio</Label>
                <Textarea
                  id="artist-bio"
                  value={newArtist.bio}
                  onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })}
                  placeholder="Enter artist bio"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="artist-location">Location</Label>
                <Input
                  id="artist-location"
                  value={newArtist.location}
                  onChange={(e) => setNewArtist({ ...newArtist, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>

              <div>
                <Label htmlFor="artist-price">Price Range</Label>
                <Select
                  value={newArtist.priceRange}
                  onValueChange={(value) => setNewArtist({ ...newArtist, priceRange: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$200-500">$200 - $500</SelectItem>
                    <SelectItem value="$500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="$1000-2000">$1,000 - $2,000</SelectItem>
                    <SelectItem value="$2000-5000">$2,000 - $5,000</SelectItem>
                    <SelectItem value="$5000+">$5,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddArtist} className="bg-purple-600 hover:bg-purple-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Artist
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <stat.icon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Artists Table */}
        <div className="lg:col-span-2">
          <Table artists={artists} title="Managed Artists" />
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{booking.artist}</p>
                        <p className="text-sm text-gray-600">{booking.event}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{booking.date}</span>
                      <span className="font-medium text-gray-900">{booking.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
