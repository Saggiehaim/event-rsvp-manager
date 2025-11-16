import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GearSix } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useGoogleMapsApiKey } from '@/lib/config'

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const [apiKey, setApiKey, deleteApiKey] = useGoogleMapsApiKey()
  const [inputValue, setInputValue] = useState('')

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setInputValue(apiKey || '')
    }
  }

  const handleSave = () => {
    if (inputValue.trim()) {
      setApiKey(inputValue.trim())
      toast.success('Google Maps API key saved successfully')
    } else {
      deleteApiKey()
      toast.success('Google Maps API key removed')
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <GearSix size={20} weight="duotone" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription className="text-base">
            Configure your Event Hub preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="google-api-key">
              Google Maps API Key (Optional)
            </Label>
            <Input
              id="google-api-key"
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your Google Maps API key"
              className="text-base font-mono"
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Add your Google Maps API key to enable autocomplete for addresses. Without a key, 
              the app will use OpenStreetMap (which may be slower).
              <br />
              <a 
                href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get a Google Maps API key →
              </a>
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
