"use client"

import { useState, useMemo } from "react"
import { ArtistCard } from "@/components/artist-card"
import { FilterBlock } from "@/components/filter-block"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Grid, List } from "lucide-react"
import artistsData from "@/data/artists.json"
import categoriesData from "@/data/categories.json"

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

interface Filters {
  categories: string[]
  location: string
}

export default function ArtistsPage() {
  const [artists] = useState<Artist[]>(artistsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    location: "",
  })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter artists based on search term and filters
  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.location.toLowerCase().includes(searchTerm.toLowerCase())

      // Category filter
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(artist.category)

      // Location filter
      const matchesLocation =
        filters.location === "" || artist.location.toLowerCase().includes(filters.location.toLowerCase())

      return matchesSearch && matchesCategory && matchesLocation
    })
  }, [artists, searchTerm, filters])

  // Helper function to check if artist's price range matches filter
  const checkPriceRange = (artistPrice: string, filterRange: string) => {
    if (filterRange === "") return true

    // Extract numbers from artist price (e.g., "$500-1000" -> [500, 1000])
    const artistPriceNumbers = artistPrice.match(/\d+/g)?.map(Number) || []
    if (artistPriceNumbers.length === 0) return false

    const artistMin = Math.min(...artistPriceNumbers)
    const artistMax = Math.max(...artistPriceNumbers)

    switch (filterRange) {
      case "0-500":
        return artistMax <= 500
      case "500-1000":
        return artistMin >= 500 && artistMax <= 1000
      case "1000-2000":
        return artistMin >= 1000 && artistMax <= 2000
      case "2000-5000":
        return artistMin >= 2000 && artistMax <= 5000
      case "5000+":
        return artistMin >= 5000
      default:
        return true
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Artists</h1>
        <p className="text-gray-600 mb-6">Discover talented performing artists for your next event</p>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search artists, locations, or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="hidden sm:flex"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="hidden sm:flex"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterBlock categories={categoriesData} onFiltersChange={setFilters} />
        </div>

        {/* Artists Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              {filteredArtists.length} artist{filteredArtists.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredArtists.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No artists found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {filteredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
