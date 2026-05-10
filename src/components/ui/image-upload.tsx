'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { FiUpload, FiX } from 'react-icons/fi'

interface ImageUploadProps {
  value: string[]
  onChange: (images: string[]) => void
  label?: string
  maxImages?: number
}

export function ImageUpload({ value = [], onChange, label = 'Images', maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (value.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setError(null)
    setUploading(true)

    try {
      const newImages: string[] = []

      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('image', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          newImages.push(data.url)
        } else {
          const data = await res.json()
          setError(data.error || 'Failed to upload image')
        }
      }

      if (newImages.length > 0) {
        onChange([...value, ...newImages])
      }
    } catch {
      setError('Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...value]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    onChange(newImages)
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          <span className="text-slate-400 font-normal ml-1">(Max {maxImages} images)</span>
        </label>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group"
            >
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100"
                    title="Move right"
                  >
                    →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  title="Remove"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Primary badge */}
              {index === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {value.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-600">Uploading...</span>
              </>
            ) : (
              <>
                <FiUpload className="w-5 h-5 text-slate-500" />
                <span className="text-slate-600">Click to upload images</span>
              </>
            )}
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-slate-500">
        Images will be automatically resized to max 1200x1200px. Supported: JPEG, PNG, WebP, GIF (Max 5MB each)
      </p>
    </div>
  )
}