"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, ExternalLink, AlertTriangle, CheckCircle, Clock, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Dependency {
  name: string
  version: string
  type: "production" | "development" | "peer"
  description?: string
  homepage?: string
  license?: string
  size?: string
  vulnerabilities?: number
  outdated?: boolean
  usedBy?: string[]
}

const mockDependencies: Dependency[] = [
  {
    name: "react",
    version: "18.2.0",
    type: "production",
    description: "React is a JavaScript library for building user interfaces",
    homepage: "https://reactjs.org/",
    license: "MIT",
    size: "42.2 kB",
    vulnerabilities: 0,
    outdated: false,
    usedBy: ["src/components/Button.tsx", "src/components/Modal.tsx", "src/App.tsx"],
  },
  {
    name: "react-dom",
    version: "18.2.0",
    type: "production",
    description: "React package for working with the DOM",
    homepage: "https://reactjs.org/",
    license: "MIT",
    size: "130.2 kB",
    vulnerabilities: 0,
    outdated: false,
    usedBy: ["src/index.tsx"],
  },
  {
    name: "typescript",
    version: "4.9.5",
    type: "development",
    description: "TypeScript is a language for application scale JavaScript",
    homepage: "https://www.typescriptlang.org/",
    license: "Apache-2.0",
    size: "34.1 MB",
    vulnerabilities: 0,
    outdated: true,
    usedBy: [],
  },
  {
    name: "lodash",
    version: "4.17.19",
    type: "production",
    description: "Lodash modular utilities",
    homepage: "https://lodash.com/",
    license: "MIT",
    size: "528.3 kB",
    vulnerabilities: 2,
    outdated: true,
    usedBy: ["src/utils/helpers.ts", "src/hooks/useApi.ts"],
  },
  {
    name: "axios",
    version: "1.4.0",
    type: "production",
    description: "Promise based HTTP client for the browser and node.js",
    homepage: "https://axios-http.com/",
    license: "MIT",
    size: "32.7 kB",
    vulnerabilities: 0,
    outdated: false,
    usedBy: ["src/hooks/useApi.ts", "src/services/api.ts"],
  },
  {
    name: "@types/react",
    version: "18.2.14",
    type: "development",
    description: "TypeScript definitions for React",
    license: "MIT",
    size: "3.2 MB",
    vulnerabilities: 0,
    outdated: false,
    usedBy: [],
  },
  {
    name: "eslint",
    version: "8.44.0",
    type: "development",
    description: "An AST-based pattern checker for JavaScript",
    homepage: "https://eslint.org",
    license: "MIT",
    size: "2.1 MB",
    vulnerabilities: 0,
    outdated: false,
    usedBy: [],
  },
  {
    name: "moment",
    version: "2.29.1",
    type: "production",
    description: "Parse, validate, manipulate, and display dates",
    homepage: "https://momentjs.com",
    license: "MIT",
    size: "288.1 kB",
    vulnerabilities: 1,
    outdated: true,
    usedBy: ["src/utils/dateHelpers.ts"],
  },
]

function getDependencyTypeColor(type: Dependency["type"]) {
  switch (type) {
    case "production":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "development":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "peer":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function DependencyCard({ dependency }: { dependency: Dependency }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">{dependency.name}</CardTitle>
              <CardDescription className="text-sm">v{dependency.version}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getDependencyTypeColor(dependency.type)}>{dependency.type}</Badge>
            {dependency.vulnerabilities && dependency.vulnerabilities > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {dependency.vulnerabilities}
              </Badge>
            )}
            {dependency.outdated && (
              <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/20">
                <Clock className="h-3 w-3 mr-1" />
                Outdated
              </Badge>
            )}
            {!dependency.vulnerabilities && !dependency.outdated && (
              <Badge variant="outline" className="text-xs text-green-400 border-green-400/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Up to date
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dependency.description && <p className="text-sm text-muted-foreground">{dependency.description}</p>}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {dependency.license && <span>License: {dependency.license}</span>}
              {dependency.size && <span>Size: {dependency.size}</span>}
            </div>
            {dependency.homepage && (
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>

          {dependency.usedBy && dependency.usedBy.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 px-0 text-xs text-muted-foreground hover:text-foreground"
              >
                Used by {dependency.usedBy.length} file{dependency.usedBy.length !== 1 ? "s" : ""}
              </Button>
              {isExpanded && (
                <div className="mt-2 space-y-1">
                  {dependency.usedBy.map((file) => (
                    <div key={file} className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                      {file}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function DependencyGraph() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "production" | "development" | "peer">("all")
  const [showOutdated, setShowOutdated] = useState(false)
  const [showVulnerable, setShowVulnerable] = useState(false)

  const filteredDependencies = mockDependencies.filter((dep) => {
    const matchesSearch =
      dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || dep.type === filterType
    const matchesOutdated = !showOutdated || dep.outdated
    const matchesVulnerable = !showVulnerable || (dep.vulnerabilities && dep.vulnerabilities > 0)

    return matchesSearch && matchesType && matchesOutdated && matchesVulnerable
  })

  const stats = {
    total: mockDependencies.length,
    production: mockDependencies.filter((d) => d.type === "production").length,
    development: mockDependencies.filter((d) => d.type === "development").length,
    outdated: mockDependencies.filter((d) => d.outdated).length,
    vulnerable: mockDependencies.filter((d) => d.vulnerabilities && d.vulnerabilities > 0).length,
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.production}</div>
            <div className="text-sm text-muted-foreground">Production</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.development}</div>
            <div className="text-sm text-muted-foreground">Development</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.outdated}</div>
            <div className="text-sm text-muted-foreground">Outdated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.vulnerable}</div>
            <div className="text-sm text-muted-foreground">Vulnerable</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search dependencies..."
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
                variant={filterType === "production" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("production")}
              >
                Production
              </Button>
              <Button
                variant={filterType === "development" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("development")}
              >
                Development
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showOutdated ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOutdated(!showOutdated)}
              >
                <Clock className="h-4 w-4 mr-1" />
                Outdated Only
              </Button>
              <Button
                variant={showVulnerable ? "destructive" : "outline"}
                size="sm"
                onClick={() => setShowVulnerable(!showVulnerable)}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Vulnerable Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dependencies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDependencies.map((dependency) => (
          <DependencyCard key={dependency.name} dependency={dependency} />
        ))}
      </div>

      {filteredDependencies.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No dependencies match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
