import { useState, useCallback } from 'react'
import { Image, Upload, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      return
    }

    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target?.result) {
        const dataUrl = e.target.result as string
        
        try {
          // Upload to blob storage
          const fileName = `${Date.now()}-${file.name}`
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName,
              data: dataUrl,
              contentType: file.type
            })
          })
          
          if (!response.ok) {
            const error = await response.text()
            console.error('Upload failed:', error)
            throw new Error(`Upload failed: ${error}`)
          }
          
          const result = await response.json()
          console.log('Image uploaded to blob storage:', result.url)
          onChange(result.url)
        } catch (error) {
          console.error('Error uploading image:', error)
          // Fallback to data URL if upload fails
          onChange(dataUrl)
        } finally {
          setUploading(false)
        }
      }
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleRemove = useCallback(() => {
    onChange('')
  }, [onChange])

  if (value) {
    return (
      <div className={cn("relative aspect-[3/4] w-full overflow-hidden rounded-lg", className)}>
        <img 
          src={value} 
          alt="Event poster" 
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
        >
          <X size={20} weight="bold" />
        </button>
      </div>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors",
        isDragging 
          ? "border-primary bg-primary/5" 
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
        className
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="absolute inset-0 cursor-pointer opacity-0"
        id="poster-upload"
        disabled={uploading}
      />
      <label 
        htmlFor="poster-upload" 
        className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 px-4 text-center"
      >
        <div className="rounded-full bg-primary/10 p-4">
          {uploading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          ) : isDragging ? (
            <Upload size={32} weight="duotone" className="text-primary" />
          ) : (
            <Image size={32} weight="duotone" className="text-primary" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {uploading ? 'Uploading...' : isDragging ? 'Drop image here' : 'Upload event poster'}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Max 5MB • PNG, JPG, WEBP
          </p>
        </div>
      </label>
    </div>
  )
}
