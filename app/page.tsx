"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Calendar, Star, Shield, Music, Mic, Users2, MessageSquare } from "lucide-react"
import categoriesData from "@/data/categories.json"
import { AuthModal } from "@/components/auth-modal"

interface UserType {
  name: string
  email: string
  role: string
}

export default function HomePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("artistly_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleAuthSuccess = (userData: UserType) => {
    setUser(userData)
    // The button will automatically update due to the user state change
  }

  const features = [
    {
      icon: Users,
      title: "Verified Artists",
      description: "All artists are professionally vetted and verified",
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Streamlined booking process with instant quotes",
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "Top-rated performers with excellent reviews",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Book Amazing
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Performing Artists
                </span>
              </h1>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Connect with talented singers, DJs, dancers, and speakers for your next event. Professional artists,
                verified profiles, and seamless booking experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                    <Link href="/artists">
                      Explore Artists
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Music className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Live Music</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Mic className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Speakers</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users2 className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Dancers</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">DJs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find the Perfect Artist</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our curated selection of professional performing artists across multiple categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoriesData.map((category) => (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600"
                  >
                    <Link href={`/artists?category=${category.id}`}>Browse {category.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Artistly?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and book the perfect artist for your event
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Next Artist?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of event planners who trust Artistly for their entertainment needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/artists">
                Start Browsing Artists
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
    </div>
  )
}
