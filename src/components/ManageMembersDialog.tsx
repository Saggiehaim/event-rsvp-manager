import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { User, Users, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Event } from '@/lib/types'

interface ManageMembersDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (selectedRsvpIds: string[]) => void
}

export function ManageMembersDialog({ event, open, onOpenChange, onSave }: ManageMembersDialogProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setSelectedIds(new Set(event.rsvps.map(rsvp => rsvp.id)))
  }, [event])

  const handleToggle = (rsvpId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(rsvpId)) {
      newSelected.delete(rsvpId)
    } else {
      newSelected.add(rsvpId)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === event.rsvps.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(event.rsvps.map(rsvp => rsvp.id)))
    }
  }

  const handleRemoveSelected = () => {
    const removedCount = event.rsvps.length - selectedIds.size
    if (removedCount === 0) {
      toast.error('No members selected for removal')
      return
    }

    setIsSubmitting(true)
    onSave(Array.from(selectedIds))
    toast.success(`Removed ${removedCount} ${removedCount === 1 ? 'member' : 'members'}`)
    setIsSubmitting(false)
  }

  const allSelected = selectedIds.size === event.rsvps.length && event.rsvps.length > 0
  const someSelected = selectedIds.size > 0 && selectedIds.size < event.rsvps.length
  const removedCount = event.rsvps.length - selectedIds.size

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Manage Members</DialogTitle>
          <DialogDescription>
            Select members to keep for <span className="font-semibold text-foreground">{event.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </label>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <Users size={14} weight="duotone" />
              {selectedIds.size} / {event.rsvps.length} selected
            </Badge>
          </div>

          <Separator />

          {event.rsvps.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8">
              <div className="text-center">
                <Users size={48} weight="duotone" className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No members yet</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-lg border">
              <div className="space-y-1 p-4">
                {event.rsvps.map((rsvp, index) => {
                  const isSelected = selectedIds.has(rsvp.id)
                  
                  return (
                    <div
                      key={rsvp.id}
                      className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                        isSelected
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        id={`member-${rsvp.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(rsvp.id)}
                      />
                      <div className="flex flex-1 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User size={20} weight="duotone" />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor={`member-${rsvp.id}`}
                            className="block cursor-pointer font-medium text-foreground"
                          >
                            {rsvp.guestName}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {rsvp.attendeeCount} {rsvp.attendeeCount === 1 ? 'attendee' : 'attendees'} · 
                            RSVP'd {new Date(rsvp.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}

          {removedCount > 0 && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <div className="flex items-center gap-2">
                <Trash size={16} weight="duotone" />
                <span className="font-medium">
                  {removedCount} {removedCount === 1 ? 'member' : 'members'} will be removed
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemoveSelected}
              disabled={isSubmitting || removedCount === 0}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
