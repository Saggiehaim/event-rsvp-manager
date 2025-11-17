import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { User, Users, Trash, PencilSimple, Check, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Event, RSVP } from '@/lib/types'

interface ManageMembersDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedRsvps: RSVP[]) => void
}

export function ManageMembersDialog({ event, open, onOpenChange, onSave }: ManageMembersDialogProps) {
  const [rsvps, setRsvps] = useState<RSVP[]>(event.rsvps)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ guestName: '', adults: '', kids: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setRsvps(event.rsvps)
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
    if (selectedIds.size === rsvps.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(rsvps.map(rsvp => rsvp.id)))
    }
  }

  const handleStartEdit = (rsvp: RSVP) => {
    setEditingId(rsvp.id)
    setEditForm({
      guestName: rsvp.guestName,
      adults: rsvp.adults.toString(),
      kids: rsvp.kids.toString()
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ guestName: '', adults: '', kids: '' })
  }

  const handleSaveEdit = (rsvpId: string) => {
    const adults = parseInt(editForm.adults, 10)
    const kids = parseInt(editForm.kids, 10)

    if (!editForm.guestName.trim() || isNaN(adults) || isNaN(kids) || adults < 0 || kids < 0) {
      toast.error('Please enter valid values')
      return
    }

    setRsvps(rsvps.map(rsvp =>
      rsvp.id === rsvpId
        ? {
            ...rsvp,
            guestName: editForm.guestName.trim(),
            adults,
            kids,
            attendeeCount: adults + kids
          }
        : rsvp
    ))
    setEditingId(null)
    setEditForm({ guestName: '', adults: '', kids: '' })
  }

  const handleRemoveSelected = () => {
    const remainingRsvps = rsvps.filter(rsvp => selectedIds.has(rsvp.id))
    const removedCount = rsvps.length - remainingRsvps.length
    
    if (removedCount === 0) {
      toast.error('No members selected for removal')
      return
    }

    setIsSubmitting(true)
    onSave(remainingRsvps)
    toast.success(`Removed ${removedCount} ${removedCount === 1 ? 'member' : 'members'}`)
    setIsSubmitting(false)
  }

  const handleSaveAll = () => {
    setIsSubmitting(true)
    onSave(rsvps.filter(rsvp => selectedIds.has(rsvp.id)))
    toast.success('Changes saved successfully')
    setIsSubmitting(false)
  }

  const allSelected = selectedIds.size === rsvps.length && rsvps.length > 0
  const someSelected = selectedIds.size > 0 && selectedIds.size < rsvps.length
  const removedCount = rsvps.length - selectedIds.size

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
              {selectedIds.size} / {rsvps.length} selected
            </Badge>
          </div>

          <Separator />

          {rsvps.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8">
              <div className="text-center">
                <Users size={48} weight="duotone" className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No members yet</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-lg border">
              <div className="space-y-1 p-4">
                {rsvps.map((rsvp) => {
                  const isSelected = selectedIds.has(rsvp.id)
                  const isEditing = editingId === rsvp.id
                  
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
                        disabled={isEditing}
                      />
                      
                      {isEditing ? (
                        <div className="flex flex-1 flex-col gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-name-${rsvp.id}`} className="text-xs">
                              Guest Name
                            </Label>
                            <Input
                              id={`edit-name-${rsvp.id}`}
                              value={editForm.guestName}
                              onChange={(e) => setEditForm({ ...editForm, guestName: e.target.value })}
                              className="h-8"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label htmlFor={`edit-adults-${rsvp.id}`} className="text-xs">
                                Adults
                              </Label>
                              <Input
                                id={`edit-adults-${rsvp.id}`}
                                type="number"
                                min="0"
                                value={editForm.adults}
                                onChange={(e) => setEditForm({ ...editForm, adults: e.target.value })}
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-kids-${rsvp.id}`} className="text-xs">
                                Kids
                              </Label>
                              <Input
                                id={`edit-kids-${rsvp.id}`}
                                type="number"
                                min="0"
                                value={editForm.kids}
                                onChange={(e) => setEditForm({ ...editForm, kids: e.target.value })}
                                className="h-8"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSaveEdit(rsvp.id)}
                              className="h-7 gap-1 px-2"
                            >
                              <Check size={14} weight="bold" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              className="h-7 gap-1 px-2 text-muted-foreground"
                            >
                              <X size={14} weight="bold" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-1 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User size={20} weight="duotone" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {rsvp.guestName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {rsvp.adults} adult{rsvp.adults !== 1 ? 's' : ''}, {rsvp.kids} kid{rsvp.kids !== 1 ? 's' : ''} · 
                                RSVP'd {new Date(rsvp.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(rsvp)}
                            className="shrink-0 gap-1"
                          >
                            <PencilSimple size={16} weight="duotone" />
                            Edit
                          </Button>
                        </>
                      )}
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
              onClick={handleSaveAll}
              disabled={isSubmitting || editingId !== null}
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
