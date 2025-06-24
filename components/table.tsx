"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface Artist {
  id: number
  name: string
  category: string
  location: string
  priceRange: string
  bio?: string
  rating?: number
  reviewCount?: number
}

interface TableProps {
  artists: Artist[]
  title: string
}

export function Table({ artists, title }: TableProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

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

  const handleViewDetails = (artist: Artist) => {
    setSelectedArtist(artist)
    setIsViewModalOpen(true)
  }

  const handleEdit = (artist: Artist) => {
    console.log("Edit artist:", artist)
    // Implement edit functionality
    alert(`Edit functionality for ${artist.name} - Coming soon!`)
  }

  const handleDelete = (artist: Artist) => {
    console.log("Delete artist:", artist)
    // Implement delete functionality
    if (confirm(`Are you sure you want to delete ${artist.name}?`)) {
      alert(`Delete functionality for ${artist.name} - Coming soon!`)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fee Range</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr key={artist.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{artist.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getCategoryColor(artist.category)}>{getCategoryLabel(artist.category)}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{artist.location}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{artist.priceRange}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(artist)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(artist)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(artist)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Artist Details</DialogTitle>
          </DialogHeader>
          {selectedArtist && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedArtist.name}</h3>
                <Badge className={getCategoryColor(selectedArtist.category)}>
                  {getCategoryLabel(selectedArtist.category)}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-gray-900">{selectedArtist.location}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Fee Range</p>
                <p className="text-gray-900 font-medium">{selectedArtist.priceRange}</p>
              </div>

              {selectedArtist.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Bio</p>
                  <p className="text-gray-900">{selectedArtist.bio}</p>
                </div>
              )}

              {selectedArtist.rating && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-gray-900">
                    {selectedArtist.rating}/5 ({selectedArtist.reviewCount} reviews)
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
