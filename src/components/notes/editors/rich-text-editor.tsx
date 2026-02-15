'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Image as ImageIcon, Undo, Redo } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

/* ── Toolbar ──────────────────────────────────────────────────── */

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  function addImage() {
    const url = window.prompt('URL da imagem:')
    if (url) {
      editor!.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/5 bg-white/5 sticky top-0 z-10 backdrop-blur-xl">
      <Toggle
        size="sm"
        type="button"
        pressed={editor!.isActive('bold')}
        onPressedChange={() => editor!.chain().focus().toggleBold().run()}
        aria-label="Bold"
        className="data-[state=on]:bg-violet-600 data-[state=on]:text-white hover:bg-white/10 hover:text-white text-gray-400"
      >
        <Bold className="w-4 h-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        type="button"
        pressed={editor!.isActive('italic')}
        onPressedChange={() => editor!.chain().focus().toggleItalic().run()}
        aria-label="Italic"
        className="data-[state=on]:bg-violet-600 data-[state=on]:text-white hover:bg-white/10 hover:text-white text-gray-400"
      >
        <Italic className="w-4 h-4" />
      </Toggle>

      <Toggle
        size="sm"
        type="button"
        pressed={editor!.isActive('strike')}
        onPressedChange={() => editor!.chain().focus().toggleStrike().run()}
        aria-label="Strikethrough"
        className="data-[state=on]:bg-violet-600 data-[state=on]:text-white hover:bg-white/10 hover:text-white text-gray-400"
      >
        <Strikethrough className="w-4 h-4" />
      </Toggle>

      <Separator className="h-6 mx-2 w-px bg-white/10" />

      <Toggle
        size="sm"
        type="button"
        pressed={editor!.isActive('heading', { level: 1 })}
        onPressedChange={() => editor!.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="H1"
        className="data-[state=on]:bg-violet-600 data-[state=on]:text-white hover:bg-white/10 hover:text-white text-gray-400"
      >
        <Heading1 className="w-4 h-4" />
      </Toggle>

      <Toggle
        size="sm"
        type="button"
        pressed={editor!.isActive('heading', { level: 2 })}
        onPressedChange={() => editor!.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="H2"
        className="data-[state=on]:bg-violet-600 data-[state=on]:text-white hover:bg-white/10 hover:text-white text-gray-400"
      >
        <Heading2 className="w-4 h-4" />
      </Toggle>

      <Separator className="h-6 mx-2 w-px bg-white/10" />

      <Toggle
        size="sm"
        type="button"
        pressed={editor!.isActive('bulletList')}
        onPressedChange={() => editor!.chain().focus().toggleBulletList().run()}
        aria-label="Bullet List"
        className="data-[state=on]:bg-violet-600 data-[state=on]:text-white hover:bg-white/10 hover:text-white text-gray-400"
      >
        <List className="w-4 h-4" />
      </Toggle>

      <Toggle
        size="sm"
        type="button"
        pressed={editor!.isActive('orderedList')}
        onPressedChange={() => editor!.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered List"
        className="data-[state=on]:bg-violet-600 data-[state=on]:text-white hover:bg-white/10 hover:text-white text-gray-400"
      >
        <ListOrdered className="w-4 h-4" />
      </Toggle>

      <Separator className="h-6 mx-2 w-px bg-white/10" />

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={addImage}
        className="h-8 w-8 p-0 hover:bg-white/10 hover:text-cyan-400 text-gray-400"
        title="Inserir Imagem"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => editor!.chain().focus().undo().run()}
        disabled={!editor!.can().undo()}
        className="h-8 w-8 p-0 hover:bg-white/10 hover:text-white text-gray-400 disabled:opacity-30"
      >
        <Undo className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => editor!.chain().focus().redo().run()}
        disabled={!editor!.can().redo()}
        className="h-8 w-8 p-0 hover:bg-white/10 hover:text-white text-gray-400 disabled:opacity-30"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  )
}

/* ── RichTextEditor ───────────────────────────────────────────── */

interface RichTextEditorProps {
  content: string
  onChange: (json: string) => void
  editable?: boolean
}

export function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
  /* Tentar parsear o conteúdo como JSON, fallback para criar um documento com o texto cru */
  const initialContent = (() => {
    try {
      const json = JSON.parse(content)
      if (typeof json === 'object' && json !== null) return json
      return { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: content }] }] }
    } catch {
      /* Se falhar o parse (conteúdo legado), envelopa como parágrafo */
      return {
        type: 'doc',
        content: content ? [{ type: 'paragraph', content: [{ type: 'text', text: content }] }] : []
      }
    }
  })()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: initialContent,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-6 text-gray-100 placeholder:text-gray-500',
      },
    },
  })

  return (
    <div className="flex flex-col h-full bg-transparent">
      {editable && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  )
}
