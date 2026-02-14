'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MiniMap,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

/* ── Initial Nodes (Example) ──────────────────────────────────── */

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Ideia Central' },
    position: { x: 250, y: 50 },
    type: 'input',
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
  },
  {
    id: '2',
    data: { label: 'Desdobramento A' },
    position: { x: 100, y: 200 },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
  },
  {
    id: '3',
    data: { label: 'Desdobramento B' },
    position: { x: 400, y: 200 },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#94a3b8' } },
]

/* ── DiagramEditor ────────────────────────────────────────────── */

interface DiagramEditorProps {
  content: string
  onChange: (json: string) => void
}

export function DiagramEditor({ content, onChange }: DiagramEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges)
  const [isInitialized, setIsInitialized] = useState(false)

  /* Load initial state */
  useEffect(() => {
    if (isInitialized) return

    let initialNodesToSet = initialNodes
    let initialEdgesToSet = initialEdges

    try {
      if (content) {
        const json = JSON.parse(content)
        if (json.nodes && json.edges) {
          initialNodesToSet = json.nodes
          initialEdgesToSet = json.edges
        }
      }
    } catch {
      // Fallback to default
    }

    /* We use setNodes/setEdges from the hooks which handle internal state */
    requestAnimationFrame(() => {
      setNodes(initialNodesToSet)
      setEdges(initialEdgesToSet)
      setIsInitialized(true)
    })
  }, [content, isInitialized, setNodes, setEdges])

  /* Save state on changes */
  useEffect(() => {
    if (!isInitialized) return
    const json = JSON.stringify({ nodes, edges })
    onChange(json)
  }, [nodes, edges, isInitialized, onChange])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#94a3b8' } }, eds)),
    [setEdges]
  )

  const addNode = useCallback(() => {
    const id = crypto.randomUUID()
    const newNode: Node = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: 'Nova Ideia' },
      style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
    }
    setNodes((nds) => nds.concat(newNode))
  }, [setNodes])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const newLabel = window.prompt('Editar nome do nó:', node.data.label as string)
      if (newLabel !== null) {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return { ...n, data: { ...n.data, label: newLabel } }
            }
            return n
          })
        )
      }
    },
    [setNodes]
  )

  if (!isInitialized) return null

  return (
    <div className="h-[60vh] w-full border border-glass-border rounded-lg overflow-hidden bg-black/90 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        colorMode="dark"
      >
        <Background gap={16} size={1} color="#334155" />
        <Controls className="bg-white/10 border-none fill-white text-white" />
        <MiniMap 
          nodeStrokeColor="#334155" 
          nodeColor="#1e293b" 
          maskColor="rgba(0,0,0, 0.7)"
          className="bg-black/50 border border-glass-border"
        />
        <Panel position="top-left" className="bg-glass border border-glass-border p-2 rounded-md">
          <button
            type="button"
            onClick={addNode}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
          >
            + Adicionar Nó
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}
