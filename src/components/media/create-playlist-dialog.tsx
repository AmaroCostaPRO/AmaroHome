'use client'

import { useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, Plus, FolderPlus } from 'lucide-react'
import { createPlaylist } from '@/app/media/actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Criando...
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Criar Playlist
        </>
      )}
    </Button>
  )
}

export function CreatePlaylistDialog() {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    const title = formData.get('title') as string
    const color = formData.get('color') as string // we might want a color picker or preset colors later

    if (!title) return

    await createPlaylist({
      title,
      color: color || undefined,
      icon: 'ListMusic', // Default icon for now
    })

    formRef.current?.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start pl-3 bg-linear-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 group">
          <div className="bg-indigo-500/20 p-1.5 rounded-md mr-3 group-hover:bg-indigo-500/30 transition-colors">
            <FolderPlus className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
          </div>
          Nova Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-panel border-white/10">
        <DialogHeader>
          <DialogTitle>Nova Playlist</DialogTitle>
          <DialogDescription>
            Crie uma coleção para organizar suas músicas e vídeos.
          </DialogDescription>
        </DialogHeader>
        
        <form ref={formRef} action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nome</label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Músicas para Programar, Vídeos de React..."
              required
              className="bg-black/20 border-white/10 focus:border-indigo-500/50"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="color" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cor (Opcional)</label>
            <div className="flex gap-2">
               {/* Simple color selection for now - could be improved with a proper picker */}
               {['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'].map((c) => (
                 <div key={c} className="relative">
                   <input 
                    type="radio" 
                    name="color" 
                    value={c} 
                    id={`color-${c}`} 
                    className="peer sr-only"
                   />
                   <label 
                    htmlFor={`color-${c}`}
                    className="block w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform peer-checked:ring-2 peer-checked:ring-white peer-checked:ring-offset-1 peer-checked:ring-offset-black"
                    style={{ backgroundColor: c }}
                   />
                 </div>
               ))}
            </div>
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
