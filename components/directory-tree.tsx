"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Folder,
  FolderOpen,
  File,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  FileText,
  FileCode,
  FileImage,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileNode {
  name: string
  type: "file" | "directory"
  path: string
  size?: number
  children?: FileNode[]
  language?: string
  lines?: number
}

const mockDirectoryData: FileNode = {
  name: "repository-root",
  type: "directory",
  path: "/",
  children: [
    {
      name: "src",
      type: "directory",
      path: "/src",
      children: [
        {
          name: "components",
          type: "directory",
          path: "/src/components",
          children: [
            {
              name: "Button.tsx",
              type: "file",
              path: "/src/components/Button.tsx",
              language: "typescript",
              lines: 45,
              size: 1234,
            },
            {
              name: "Modal.tsx",
              type: "file",
              path: "/src/components/Modal.tsx",
              language: "typescript",
              lines: 78,
              size: 2156,
            },
            {
              name: "Form.tsx",
              type: "file",
              path: "/src/components/Form.tsx",
              language: "typescript",
              lines: 123,
              size: 3421,
            },
          ],
        },
        {
          name: "hooks",
          type: "directory",
          path: "/src/hooks",
          children: [
            {
              name: "useAuth.ts",
              type: "file",
              path: "/src/hooks/useAuth.ts",
              language: "typescript",
              lines: 67,
              size: 1876,
            },
            {
              name: "useApi.ts",
              type: "file",
              path: "/src/hooks/useApi.ts",
              language: "typescript",
              lines: 89,
              size: 2543,
            },
          ],
        },
        {
          name: "utils",
          type: "directory",
          path: "/src/utils",
          children: [
            {
              name: "helpers.ts",
              type: "file",
              path: "/src/utils/helpers.ts",
              language: "typescript",
              lines: 156,
              size: 4321,
            },
            {
              name: "constants.ts",
              type: "file",
              path: "/src/utils/constants.ts",
              language: "typescript",
              lines: 23,
              size: 567,
            },
          ],
        },
      ],
    },
    {
      name: "public",
      type: "directory",
      path: "/public",
      children: [
        { name: "favicon.ico", type: "file", path: "/public/favicon.ico", language: "binary", size: 1024 },
        { name: "logo.svg", type: "file", path: "/public/logo.svg", language: "svg", size: 2048 },
      ],
    },
    { name: "package.json", type: "file", path: "/package.json", language: "json", lines: 45, size: 1234 },
    { name: "tsconfig.json", type: "file", path: "/tsconfig.json", language: "json", lines: 23, size: 567 },
    { name: "README.md", type: "file", path: "/README.md", language: "markdown", lines: 89, size: 2345 },
  ],
}

function getFileIcon(fileName: string, language?: string) {
  if (language === "typescript" || fileName.endsWith(".ts") || fileName.endsWith(".tsx")) {
    return <FileCode className="h-4 w-4 text-blue-400" />
  }
  if (language === "javascript" || fileName.endsWith(".js") || fileName.endsWith(".jsx")) {
    return <FileCode className="h-4 w-4 text-yellow-400" />
  }
  if (language === "json" || fileName.endsWith(".json")) {
    return <Settings className="h-4 w-4 text-orange-400" />
  }
  if (language === "markdown" || fileName.endsWith(".md")) {
    return <FileText className="h-4 w-4 text-green-400" />
  }
  if (language === "svg" || fileName.endsWith(".svg") || fileName.endsWith(".png") || fileName.endsWith(".jpg")) {
    return <FileImage className="h-4 w-4 text-purple-400" />
  }
  return <File className="h-4 w-4 text-muted-foreground" />
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface TreeNodeProps {
  node: FileNode
  level: number
  onSelect: (node: FileNode) => void
  selectedPath?: string
}

function TreeNode({ node, level, onSelect, selectedPath }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const isSelected = selectedPath === node.path

  const handleToggle = () => {
    if (node.type === "directory") {
      setIsExpanded(!isExpanded)
    }
    onSelect(node)
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-accent/50 transition-colors",
          isSelected && "bg-accent text-accent-foreground",
          "text-sm",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {node.type === "directory" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-400" />
            ) : (
              <Folder className="h-4 w-4 text-blue-400" />
            )}
          </>
        ) : (
          <>
            <div className="w-3" />
            {getFileIcon(node.name, node.language)}
          </>
        )}

        <span className="flex-1 truncate">{node.name}</span>

        {node.type === "file" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {node.lines && <span>{node.lines} lines</span>}
            {node.size && <span>{formatFileSize(node.size)}</span>}
          </div>
        )}
      </div>

      {node.type === "directory" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.path} node={child} level={level + 1} onSelect={onSelect} selectedPath={selectedPath} />
          ))}
        </div>
      )}
    </div>
  )
}

export function DirectoryTree() {
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "files" | "directories">("all")

  const handleNodeSelect = (node: FileNode) => {
    setSelectedNode(node)
  }

  const getFileStats = (
    node: FileNode,
  ): { files: number; directories: number; totalSize: number; totalLines: number } => {
    let files = 0
    let directories = 0
    let totalSize = 0
    let totalLines = 0

    if (node.type === "file") {
      files = 1
      totalSize = node.size || 0
      totalLines = node.lines || 0
    } else {
      directories = 1
      if (node.children) {
        for (const child of node.children) {
          const childStats = getFileStats(child)
          files += childStats.files
          directories += childStats.directories
          totalSize += childStats.totalSize
          totalLines += childStats.totalLines
        }
      }
    }

    return { files, directories, totalSize, totalLines }
  }

  const stats = getFileStats(mockDirectoryData)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Directory Tree */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Directory Structure
                </CardTitle>
                <CardDescription>Browse the repository file structure</CardDescription>
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
                  variant={filterType === "files" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("files")}
                >
                  Files
                </Button>
                <Button
                  variant={filterType === "directories" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("directories")}
                >
                  Folders
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files and directories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-lg max-h-96 overflow-y-auto">
              <TreeNode
                node={mockDirectoryData}
                level={0}
                onSelect={handleNodeSelect}
                selectedPath={selectedNode?.path}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Details */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.files}</div>
                <div className="text-sm text-muted-foreground">Files</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-chart-2">{stats.directories}</div>
                <div className="text-sm text-muted-foreground">Directories</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Size:</span>
                <span className="font-mono">{formatFileSize(stats.totalSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Lines:</span>
                <span className="font-mono">{stats.totalLines.toLocaleString()}</span>
              </div>
            </div>

            {selectedNode && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold mb-2">Selected Item</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {selectedNode.type === "directory" ? (
                      <Folder className="h-4 w-4 text-blue-400" />
                    ) : (
                      getFileIcon(selectedNode.name, selectedNode.language)
                    )}
                    <span className="font-mono text-xs">{selectedNode.name}</span>
                  </div>
                  <div className="text-muted-foreground">
                    <div>Path: {selectedNode.path}</div>
                    <div>Type: {selectedNode.type}</div>
                    {selectedNode.language && <div>Language: {selectedNode.language}</div>}
                    {selectedNode.lines && <div>Lines: {selectedNode.lines}</div>}
                    {selectedNode.size && <div>Size: {formatFileSize(selectedNode.size)}</div>}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
