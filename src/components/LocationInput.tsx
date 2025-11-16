import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface LocationInputProps {
  address: string
  locationName: string
  onAddressChange: (address: string, coordinates?: { lat: number; lng: number }) => void
  onLocationNameChange: (name: string) => void
  googleApiKey?: string
}

interface PlacePrediction {
  description: string
  place_id: string
  lat?: number
  lng?: number
}

export function LocationInput({ 
  address, 
  locationName,
  onAddressChange, 
  onLocationNameChange,
  googleApiKey
}: LocationInputProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const autocompleteServiceRef = useRef<any>(null)
  const placesServiceRef = useRef<any>(null)

  useEffect(() => {
    const win = window as any
    if (googleApiKey && !win.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setGoogleLoaded(true)
        if (win.google) {
          autocompleteServiceRef.current = new win.google.maps.places.AutocompleteService()
          const mapDiv = document.createElement('div')
          const map = new win.google.maps.Map(mapDiv)
          placesServiceRef.current = new win.google.maps.places.PlacesService(map)
        }
      }
      document.head.appendChild(script)
    } else if (win.google && !googleLoaded) {
      setGoogleLoaded(true)
      autocompleteServiceRef.current = new win.google.maps.places.AutocompleteService()
      const mapDiv = document.createElement('div')
      const map = new win.google.maps.Map(mapDiv)
      placesServiceRef.current = new win.google.maps.places.PlacesService(map)
    }
  }, [googleApiKey, googleLoaded])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowPredictions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddressInputChange = async (value: string) => {
    onAddressChange(value)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (!value.trim() || value.length < 3) {
      setPredictions([])
      setShowPredictions(false)
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const win = window as any
        if (googleApiKey && googleLoaded && autocompleteServiceRef.current) {
          autocompleteServiceRef.current.getPlacePredictions(
            { input: value },
            (predictions: any[], status: string) => {
              setIsLoading(false)
              if (status === win.google?.maps.places.PlacesServiceStatus.OK && predictions) {
                const formattedPredictions = predictions.map((prediction) => ({
                  description: prediction.description,
                  place_id: prediction.place_id,
                }))
                setPredictions(formattedPredictions)
                setShowPredictions(true)
              } else {
                setPredictions([])
                setShowPredictions(false)
              }
            }
          )
        } else {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1`,
            {
              headers: {
                'Accept': 'application/json',
              }
            }
          )
          
          if (response.ok) {
            const data = await response.json()
            const formattedPredictions = data.map((item: any) => ({
              description: item.display_name,
              place_id: item.place_id.toString(),
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }))
            
            setPredictions(formattedPredictions)
            setShowPredictions(formattedPredictions.length > 0)
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Address lookup failed:', error)
        setPredictions([])
        setShowPredictions(false)
        setIsLoading(false)
      }
    }, 500)
  }

  const handleSelectPrediction = async (prediction: PlacePrediction) => {
    const win = window as any
    if (googleApiKey && googleLoaded && placesServiceRef.current && !prediction.lat) {
      placesServiceRef.current.getDetails(
        { placeId: prediction.place_id },
        (place: any, status: string) => {
          if (status === win.google?.maps.places.PlacesServiceStatus.OK && place) {
            onAddressChange(prediction.description, {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            })
          } else {
            onAddressChange(prediction.description)
          }
        }
      )
    } else if (prediction.lat && prediction.lng) {
      onAddressChange(prediction.description, {
        lat: prediction.lat,
        lng: prediction.lng
      })
    } else {
      onAddressChange(prediction.description)
    }
    
    setShowPredictions(false)
    setPredictions([])
  }

  return (
    <div ref={wrapperRef} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">
          Address <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="location"
            value={address}
            onChange={(e) => handleAddressInputChange(e.target.value)}
            onFocus={() => {
              if (predictions.length > 0) {
                setShowPredictions(true)
              }
            }}
            placeholder="123 Main Street, Brooklyn NY"
            required
            className="text-base"
          />
          {isLoading && (
            <p className="mt-1 text-xs text-muted-foreground">
              Searching addresses...
            </p>
          )}
        </div>

        <AnimatePresence>
          {showPredictions && predictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Card className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto shadow-lg">
                {predictions.map((prediction) => (
                  <Button
                    key={prediction.place_id}
                    type="button"
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-none px-4 py-3 text-left font-normal hover:bg-accent"
                    onClick={() => handleSelectPrediction(prediction)}
                  >
                    <MapPin size={18} weight="duotone" className="shrink-0 text-primary" />
                    <span className="line-clamp-2 text-sm">{prediction.description}</span>
                  </Button>
                ))}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="location-name" className="text-muted-foreground">
            Location Name (Optional)
          </Label>
          {locationName && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onLocationNameChange('')}
              className="h-auto gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X size={14} weight="bold" />
              Clear
            </Button>
          )}
        </div>
        <Input
          id="location-name"
          value={locationName}
          onChange={(e) => onLocationNameChange(e.target.value)}
          placeholder="e.g., Central Park, The Coffee Shop"
          className="text-base"
        />
        <p className="text-xs text-muted-foreground">
          Add a friendly name for this location
        </p>
      </div>
    </div>
  )
}
