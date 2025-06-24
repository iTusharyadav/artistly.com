"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X, CheckCircle, ImageIcon } from "lucide-react"
import categoriesData from "@/data/categories.json"

// Form validation schema
const schema = yup.object({
  artistName: yup.string().required("Artist name is required").min(2, "Name must be at least 2 characters"),
  bio: yup
    .string()
    .required("Bio is required")
    .min(50, "Bio must be at least 50 characters")
    .max(500, "Bio must be less than 500 characters"),
  categories: yup.array().min(1, "Please select at least one category").required("Categories are required"),
  languages: yup.array().min(1, "Please select at least one language").required("Languages are required"),
  feeRange: yup.string().required("Fee range is required"),
  location: yup.string().required("Location is required"),
})

type FormData = yup.InferType<typeof schema>

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Mandarin",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
]

const feeRanges = [
  { value: "$200-500", label: "$200 - $500" },
  { value: "$500-1000", label: "$500 - $1,000" },
  { value: "$1000-2000", label: "$1,000 - $2,000" },
  { value: "$2000-5000", label: "$2,000 - $5,000" },
  { value: "$5000+", label: "$5,000+" },
]

export default function OnboardPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      categories: [],
      languages: [],
    },
  })

  const watchedFeeRange = watch("feeRange")

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId)

    setSelectedCategories(newCategories)
    setValue("categories", newCategories, { shouldValidate: true })
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = checked
      ? [...selectedLanguages, language]
      : selectedLanguages.filter((lang) => lang !== language)

    setSelectedLanguages(newLanguages)
    setValue("languages", newLanguages, { shouldValidate: true })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Form submitted:", {
        ...data,
        categories: selectedCategories,
        languages: selectedLanguages,
        profileImage: selectedImage?.name || null,
      })

      setIsSubmitted(true)
    } catch (error) {
      console.error("Submission error:", error)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for joining Artistly! We'll review your application and get back to you within 2-3 business
              days.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>Submit Another Application</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Join as an Artist</h1>
        <p className="text-gray-600">Create your artist profile and start getting booked for amazing events</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="artistName">Artist Name *</Label>
              <Input
                id="artistName"
                {...register("artistName")}
                placeholder="Enter your stage or professional name"
                className={errors.artistName ? "border-red-500" : ""}
              />
              {errors.artistName && <p className="text-red-500 text-sm mt-1">{errors.artistName.message}</p>}
            </div>

            <div>
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="Tell us about your experience, style, and what makes you unique..."
                rows={4}
                className={errors.bio ? "border-red-500" : ""}
              />
              <p className="text-sm text-gray-500 mt-1">{watch("bio")?.length || 0}/500 characters (minimum 50)</p>
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="City, State (e.g., New York, NY)"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories *</CardTitle>
            <p className="text-sm text-gray-600">Select all categories that apply to your performances</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoriesData.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={category.id} className="cursor-pointer">
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.categories && <p className="text-red-500 text-sm mt-2">{errors.categories.message}</p>}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle>Languages Spoken *</CardTitle>
            <p className="text-sm text-gray-600">Select all languages you can perform in</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {languages.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={language}
                    checked={selectedLanguages.includes(language)}
                    onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                  />
                  <Label htmlFor={language} className="cursor-pointer text-sm">
                    {language}
                  </Label>
                </div>
              ))}
            </div>

            {selectedLanguages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedLanguages.map((language) => (
                  <Badge key={language} variant="secondary">
                    {language}
                    <button
                      type="button"
                      onClick={() => handleLanguageChange(language, false)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {errors.languages && <p className="text-red-500 text-sm mt-2">{errors.languages.message}</p>}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Range *</CardTitle>
            <p className="text-sm text-gray-600">Select your typical fee range for performances</p>
          </CardHeader>
          <CardContent>
            <Select
              value={watchedFeeRange || undefined}
              onValueChange={(value) => setValue("feeRange", value, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.feeRange ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your fee range" />
              </SelectTrigger>
              <SelectContent>
                {feeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.feeRange && <p className="text-red-500 text-sm mt-1">{errors.feeRange.message}</p>}
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
            <p className="text-sm text-gray-600">Upload a professional photo (optional)</p>
          </CardHeader>
          <CardContent>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {imagePreview ? (
              <div className="relative">
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedImage?.name}</p>
                        <p className="text-xs text-gray-500">
                          {selectedImage ? (selectedImage.size / 1024 / 1024).toFixed(2) + " MB" : ""}
                        </p>
                      </div>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={removeImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="w-32 h-32 mx-auto">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={handleImageClick}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                <Button type="button" variant="outline" className="mt-4" onClick={handleImageClick}>
                  Choose File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  )
}
