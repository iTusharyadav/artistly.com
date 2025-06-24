"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"

interface FilterBlockProps {
  categories: Array<{ id: string; name: string }>
  onFiltersChange: (filters: {
    categories: string[]
    location: string
  }) => void
}

export function FilterBlock({ categories, onFiltersChange }: FilterBlockProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId)

    setSelectedCategories(newCategories)
    onFiltersChange({
      categories: newCategories,
      location,
    })
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
    onFiltersChange({
      categories: selectedCategories,
      location: value,
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setLocation("")
    onFiltersChange({
      categories: [],
      location: "",
    })
  }

  const hasActiveFilters = selectedCategories.length > 0 || location

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="md:hidden">
              {isExpanded ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 ${isExpanded ? "block" : "hidden md:block"}`}>
        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Category</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-sm font-medium mb-2 block">
            Location
          </Label>
          <Input
            id="location"
            placeholder="Enter city or state"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
