"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network, ArrowRight, Filter, Search, Maximize2, Minimize2, RotateCcw, Download } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Node {
  id: string
  name: string
  type: "file" | "function" | "class" | "interface" | "component"
  file: string
  x?: number
  y?: number
  connections: number
}

interface Edge {
  source: string
  target: string
  type: "imports" | "calls" | "extends" | "implements" | "uses"
  weight: number
}

interface GraphData {
  nodes: Node[]
  edges: Edge[]
}

const mockGraphData: GraphData = {
  nodes: [
    { id: "Button", name: "Button", type: "component", file: "src/components/Button.tsx", connections: 8 },
    { id: "Modal", name: "Modal", type: "component", file: "src/components/Modal.tsx", connections: 3 },
    { id: "Form", name: "Form", type: "component", file: "src/components/Form.tsx", connections: 5 },
    { id: "useAuth", name: "useAuth", type: "function", file: "src/hooks/useAuth.ts", connections: 6 },
    { id: "useApi", name: "useApi", type: "function", file: "src/hooks/useApi.ts", connections: 4 },
    { id: "AuthState", name: "AuthState", type: "interface", file: "src/types/auth.ts", connections: 3 },
    { id: "UserService", name: "UserService", type: "class", file: "src/services/UserService.ts", connections: 7 },
    { id: "ApiClient", name: "ApiClient", type: "class", file: "src/services/ApiClient.ts", connections: 5 },
    { id: "HomePage", name: "HomePage", type: "component", file: "src/pages/HomePage.tsx", connections: 4 },
    { id: "ProfilePage", name: "ProfilePage", type: "component", file: "src/pages/ProfilePage.tsx", connections: 3 },
    { id: "helpers", name: "helpers", type: "file", file: "src/utils/helpers.ts", connections: 9 },
    { id: "constants", name: "constants", type: "file", file: "src/utils/constants.ts", connections: 12 },
  ],
  edges: [
    { source: "HomePage", target: "Button", type: "imports", weight: 3 },
    { source: "HomePage", target: "useAuth", type: "calls", weight: 1 },
    { source: "ProfilePage", target: "Button", type: "imports", weight: 2 },
    { source: "ProfilePage", target: "useAuth", type: "calls", weight: 1 },
    { source: "Modal", target: "Button", type: "imports", weight: 1 },
    { source: "Form", target: "Button", type: "imports", weight: 2 },
    { source: "Form", target: "helpers", type: "imports", weight: 1 },
    { source: "useAuth", target: "AuthState", type: "uses", weight: 1 },
    { source: "useAuth", target: "ApiClient", type: "calls", weight: 2 },
    { source: "useApi", target: "ApiClient", type: "calls", weight: 3 },
    { source: "UserService", target: "ApiClient", type: "extends", weight: 1 },
    { source: "UserService", target: "constants", type: "imports", weight: 1 },
    { source: "ApiClient", target: "constants", type: "imports", weight: 2 },
    { source: "helpers", target: "constants", type: "imports", weight: 1 },
  ],
}

function getNodeColor(type: Node["type"]) {
  switch (type) {
    case "component":
      return "bg-blue-500"
    case "function":
      return "bg-green-500"
    case "class":
      return "bg-purple-500"
    case "interface":
      return "bg-orange-500"
    case "file":
      return "bg-gray-500"
    default:
      return "bg-muted"
  }
}

function getEdgeColor(type: Edge["type"]) {
  switch (type) {
    case "imports":
      return "stroke-blue-400"
    case "calls":
      return "stroke-green-400"
    case "extends":
      return "stroke-purple-400"
    case "implements":
      return "stroke-orange-400"
    case "uses":
      return "stroke-gray-400"
    default:
      return "stroke-muted-foreground"
  }
}

function NetworkGraph({
  data,
  selectedNode,
  onNodeSelect,
}: {
  data: GraphData
  selectedNode: string | null
  onNodeSelect: (nodeId: string) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Simple force-directed layout simulation
  const layoutNodes = (nodes: Node[], edges: Edge[]) => {
    const width = dimensions.width
    const height = dimensions.height

    // Initialize positions randomly
    const layoutedNodes = nodes.map((node) => ({
      ...node,
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
    }))

    // Simple force simulation (simplified)
    for (let i = 0; i < 100; i++) {
      layoutedNodes.forEach((node, index) => {
        let fx = 0,
          fy = 0

        // Repulsion from other nodes
        layoutedNodes.forEach((other, otherIndex) => {
          if (index !== otherIndex) {
            const dx = node.x! - other.x!
            const dy = node.y! - other.y!
            const distance = Math.sqrt(dx * dx + dy * dy) || 1
            const force = 1000 / (distance * distance)
            fx += (dx / distance) * force
            fy += (dy / distance) * force
          }
        })

        // Attraction from connected nodes
        edges.forEach((edge) => {
          if (edge.source === node.id) {
            const target = layoutedNodes.find((n) => n.id === edge.target)
            if (target) {
              const dx = target.x! - node.x!
              const dy = target.y! - node.y!
              const distance = Math.sqrt(dx * dx + dy * dy) || 1
              const force = distance * 0.01
              fx += (dx / distance) * force
              fy += (dy / distance) * force
            }
          }
        })

        // Apply forces
        node.x = Math.max(30, Math.min(width - 30, node.x! + fx * 0.01))
        node.y = Math.max(30, Math.min(height - 30, node.y! + fy * 0.01))
      })
    }

    return layoutedNodes
  }

  const layoutedNodes = layoutNodes(data.nodes, data.edges)

  return (
    <div className="relative border rounded-lg bg-card overflow-hidden">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom * 1.2))}>
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom * 0.8))}>
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setZoom(1)
            setPan({ x: 0, y: 0 })
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        style={{ minHeight: "600px" }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-muted-foreground" />
          </marker>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Edges */}
          {data.edges.map((edge, index) => {
            const sourceNode = layoutedNodes.find((n) => n.id === edge.source)
            const targetNode = layoutedNodes.find((n) => n.id === edge.target)

            if (!sourceNode || !targetNode) return null

            return (
              <line
                key={index}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                className={`${getEdgeColor(edge.type)} opacity-60`}
                strokeWidth={Math.max(1, edge.weight)}
                markerEnd="url(#arrowhead)"
              />
            )
          })}

          {/* Nodes */}
          {layoutedNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={Math.max(15, Math.min(30, node.connections * 2))}
                className={`${getNodeColor(node.type)} cursor-pointer transition-all hover:opacity-80 ${
                  selectedNode === node.id ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                onClick={() => onNodeSelect(node.id)}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-white pointer-events-none"
                style={{ fontSize: Math.max(8, Math.min(12, node.connections)) }}
              >
                {node.name.length > 8 ? node.name.substring(0, 8) + "..." : node.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

function RelationshipList({ data, selectedNode }: { data: GraphData; selectedNode: string | null }) {
  const node = selectedNode ? data.nodes.find((n) => n.id === selectedNode) : null

  if (!node) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a node to view its relationships</p>
        </CardContent>
      </Card>
    )
  }

  const incomingEdges = data.edges.filter((e) => e.target === node.id)
  const outgoingEdges = data.edges.filter((e) => e.source === node.id)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${getNodeColor(node.type)}`} />
          {node.name}
        </CardTitle>
        <CardDescription>
          {node.file} • {node.connections} connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="incoming">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="incoming">Incoming ({incomingEdges.length})</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing ({outgoingEdges.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="space-y-2 mt-4">
            {incomingEdges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No incoming relationships</p>
            ) : (
              incomingEdges.map((edge, index) => {
                const sourceNode = data.nodes.find((n) => n.id === edge.source)
                return (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <div className={`w-3 h-3 rounded-full ${getNodeColor(sourceNode?.type || "file")}`} />
                    <span className="font-mono text-sm">{sourceNode?.name}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {edge.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">weight: {edge.weight}</span>
                  </div>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="outgoing" className="space-y-2 mt-4">
            {outgoingEdges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No outgoing relationships</p>
            ) : (
              outgoingEdges.map((edge, index) => {
                const targetNode = data.nodes.find((n) => n.id === edge.target)
                return (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <div className={`w-3 h-3 rounded-full ${getNodeColor(targetNode?.type || "file")}`} />
                    <span className="font-mono text-sm">{targetNode?.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {edge.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">weight: {edge.weight}</span>
                  </div>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export function RelationshipViewer() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | Node["type"]>("all")

  const filteredData = {
    nodes: mockGraphData.nodes.filter((node) => {
      const matchesSearch =
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.file.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || node.type === filterType
      return matchesSearch && matchesType
    }),
    edges: mockGraphData.edges.filter((edge) => {
      const sourceExists = mockGraphData.nodes.some(
        (n) =>
          n.id === edge.source &&
          (n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.file.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (filterType === "all" || n.type === filterType),
      )
      const targetExists = mockGraphData.nodes.some(
        (n) =>
          n.id === edge.target &&
          (n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.file.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (filterType === "all" || n.type === filterType),
      )
      return sourceExists && targetExists
    }),
  }

  const stats = {
    nodes: mockGraphData.nodes.length,
    edges: mockGraphData.edges.length,
    components: mockGraphData.nodes.filter((n) => n.type === "component").length,
    functions: mockGraphData.nodes.filter((n) => n.type === "function").length,
    classes: mockGraphData.nodes.filter((n) => n.type === "class").length,
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.nodes}</div>
            <div className="text-sm text-muted-foreground">Nodes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2">{stats.edges}</div>
            <div className="text-sm text-muted-foreground">Relationships</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.components}</div>
            <div className="text-sm text-muted-foreground">Components</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.functions}</div>
            <div className="text-sm text-muted-foreground">Functions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.classes}</div>
            <div className="text-sm text-muted-foreground">Classes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Graph Controls
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "component" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("component")}
              >
                Components
              </Button>
              <Button
                variant={filterType === "function" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("function")}
              >
                Functions
              </Button>
              <Button
                variant={filterType === "class" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("class")}
              >
                Classes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graph and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Relationship Graph
              </CardTitle>
              <CardDescription>Interactive visualization of code relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <NetworkGraph data={filteredData} selectedNode={selectedNode} onNodeSelect={setSelectedNode} />
            </CardContent>
          </Card>
        </div>

        <div>
          <RelationshipList data={mockGraphData} selectedNode={selectedNode} />
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Node Types</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Component</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Function</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Class</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>Interface</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Relationship Types</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-0.5 bg-blue-400" />
                  <span>Imports</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-0.5 bg-green-400" />
                  <span>Calls</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-0.5 bg-purple-400" />
                  <span>Extends</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-0.5 bg-orange-400" />
                  <span>Implements</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
