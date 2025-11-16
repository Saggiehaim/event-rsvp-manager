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
}

interface PlacePrediction {
  description: string
  place_id: string
}

type GoogleMaps = {
  maps: {
    places: {
      AutocompleteService: new () => {
        getPlacePredictions(
          request: { input: string; types?: string[] },
          callback: (predictions: Array<{ description: string; place_id: string }> | null, status: string) => void
        ): void
      }
      PlacesServiceStatus: { OK: string }
    }
    Geocoder: new () => {
      geocode(
        request: { placeId: string },
        callback: (
          results: Array<{ geometry: { location: { lat: () => number; lng: () => number } } }> | null,
          status: string
        ) => void
      ): void
    }
    GeocoderStatus: { OK: string }
  }
}

export function LocationInput({ 
  address, 
  locationName,
  onAddressChange, 
  onLocationNameChange 
}: LocationInputProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [isLoadingScript, setIsLoadingScript] = useState(true)
  const [scriptError, setScriptError] = useState(false)
  const autocompleteService = useRef<any>(null)
  const geocoder = useRef<any>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkGoogleMaps = () => {
      const google = (window as any).google as GoogleMaps | undefined
      if (google && google.maps) {
        try {
          autocompleteService.current = new google.maps.places.AutocompleteService()
          geocoder.current = new google.maps.Geocoder()
          setIsLoadingScript(false)
          setScriptError(false)
        } catch (error) {
          setScriptError(true)
          setIsLoadingScript(false)
        }
      } else {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBQZ9Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z&libraries=places`
        script.async = true
        script.defer = true
        
        script.onload = () => {
          try {
            const google = (window as any).google as GoogleMaps | undefined
            if (google && google.maps) {
              autocompleteService.current = new google.maps.places.AutocompleteService()
              geocoder.current = new google.maps.Geocoder()
              setIsLoadingScript(false)
              setScriptError(false)
            }
          } catch (error) {
            setScriptError(true)
            setIsLoadingScript(false)
          }
        }
        
        script.onerror = () => {
          setScriptError(true)
          setIsLoadingScript(false)
        }
        
        document.head.appendChild(script)
      }
    }

    checkGoogleMaps()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowPredictions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddressInputChange = (value: string) => {
    onAddressChange(value)

    if (!value.trim() || !autocompleteService.current || scriptError) {
      setPredictions([])
      setShowPredictions(false)
      return
    }

    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        types: ['geocode', 'establishment']
      },
      (predictions: any, status: string) => {
        const google = (window as any).google as GoogleMaps | undefined
        if (status === google?.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions)
          setShowPredictions(true)
        } else {
          setPredictions([])
          setShowPredictions(false)
        }
      }
    )
  }

  const handleSelectPrediction = async (placeId: string, description: string) => {
    if (!geocoder.current) return

    try {
      geocoder.current.geocode({ placeId }, (results: any, status: string) => {
        const google = (window as any).google as GoogleMaps | undefined
        if (status === google?.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location
          onAddressChange(description, {
            lat: location.lat(),
            lng: location.lng()
          })
        } else {
          onAddressChange(description)
        }
      })
    } catch (error) {
      onAddressChange(description)
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
          {scriptError && (
            <p className="mt-1 text-xs text-muted-foreground">
              Using basic text input (Maps unavailable)
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
                    onClick={() => handleSelectPrediction(prediction.place_id, prediction.description)}
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
