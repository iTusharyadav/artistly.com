import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, MessageCircle } from "lucide-react"

interface Artist {
  id: number
  name: string
  category: string
  bio: string
  priceRange: string
  location: string
  languages: string[]
  image: string
  rating: number
  reviewCount: number
}

interface ArtistCardProps {
  artist: Artist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      singers: "Singer",
      djs: "DJ",
      dancers: "Dancer",
      speakers: "Speaker",
    }
    return labels[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      singers: "bg-pink-100 text-pink-800",
      djs: "bg-blue-100 text-blue-800",
      dancers: "bg-green-100 text-green-800",
      speakers: "bg-purple-100 text-purple-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Image
          src={artist.image || "/placeholder.svg"}
          alt={artist.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <Badge className={`absolute top-3 left-3 ${getCategoryColor(artist.category)}`}>
          {getCategoryLabel(artist.category)}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 truncate">{artist.name}</h3>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{artist.rating}</span>
            <span className="text-gray-400">({artist.reviewCount})</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{artist.bio}</p>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {artist.location}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-purple-600">{artist.priceRange}</span>
          <div className="flex flex-wrap gap-1">
            {artist.languages.slice(0, 2).map((lang) => (
              <Badge key={lang} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
            {artist.languages.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{artist.languages.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask for Quote
        </Button>
      </CardFooter>
    </Card>
  )
}
