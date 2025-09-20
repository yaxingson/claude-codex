"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Code,
  FenceIcon as Function,
  Variable,
  Type,
  FileText,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react"

interface Symbol {
  name: string
  type: "function" | "class" | "interface" | "type" | "variable" | "constant" | "enum"
  file: string
  line: number
  column: number
  visibility: "public" | "private" | "protected" | "internal"
  description?: string
  parameters?: Parameter[]
  returnType?: string
  usages: Usage[]
  exports: boolean
}

interface Parameter {
  name: string
  type: string
  optional?: boolean
  defaultValue?: string
}

interface Usage {
  file: string
  line: number
  column: number
  context: string
}

const mockSymbols: Symbol[] = [
  {
    name: "Button",
    type: "function",
    file: "src/components/Button.tsx",
    line: 12,
    column: 17,
    visibility: "public",
    description: "A reusable button component with multiple variants",
    parameters: [
      { name: "children", type: "React.ReactNode" },
      { name: "variant", type: "ButtonVariant", optional: true, defaultValue: "primary" },
      { name: "size", type: "ButtonSize", optional: true, defaultValue: "medium" },
      { name: "onClick", type: "() => void", optional: true },
    ],
    returnType: "JSX.Element",
    exports: true,
    usages: [
      { file: "src/pages/Home.tsx", line: 45, column: 12, context: '<Button variant="primary">Click me</Button>' },
      { file: "src/components/Modal.tsx", line: 78, column: 8, context: "<Button onClick={onClose}>Cancel</Button>" },
      { file: "src/components/Form.tsx", line: 123, column: 16, context: '<Button type="submit">Submit</Button>' },
    ],
  },
  {
    name: "useAuth",
    type: "function",
    file: "src/hooks/useAuth.ts",
    line: 8,
    column: 17,
    visibility: "public",
    description: "Custom hook for authentication state management",
    parameters: [],
    returnType: "AuthState",
    exports: true,
    usages: [
      { file: "src/components/Header.tsx", line: 15, column: 20, context: "const { user, login, logout } = useAuth()" },
      { file: "src/pages/Profile.tsx", line: 12, column: 20, context: "const { user } = useAuth()" },
    ],
  },
  {
    name: "AuthState",
    type: "interface",
    file: "src/types/auth.ts",
    line: 3,
    column: 17,
    visibility: "public",
    description: "Interface defining the authentication state structure",
    exports: true,
    usages: [
      { file: "src/hooks/useAuth.ts", line: 8, column: 35, context: "export function useAuth(): AuthState" },
      {
        file: "src/context/AuthContext.tsx",
        line: 12,
        column: 25,
        context: "const [state, setState] = useState<AuthState>",
      },
    ],
  },
  {
    name: "API_BASE_URL",
    type: "constant",
    file: "src/utils/constants.ts",
    line: 1,
    column: 13,
    visibility: "public",
    description: "Base URL for API endpoints",
    exports: true,
    usages: [
      { file: "src/services/api.ts", line: 5, column: 25, context: "const baseURL = API_BASE_URL" },
      { file: "src/hooks/useApi.ts", line: 18, column: 32, context: "fetch(`${API_BASE_URL}/users`)" },
    ],
  },
  {
    name: "validateEmail",
    type: "function",
    file: "src/utils/helpers.ts",
    line: 23,
    column: 17,
    visibility: "public",
    description: "Validates email address format",
    parameters: [{ name: "email", type: "string" }],
    returnType: "boolean",
    exports: true,
    usages: [
      { file: "src/components/LoginForm.tsx", line: 34, column: 12, context: "if (!validateEmail(email))" },
      {
        file: "src/components/SignupForm.tsx",
        line: 45,
        column: 12,
        context: "const isValid = validateEmail(formData.email)",
      },
    ],
  },
  {
    name: "UserRole",
    type: "enum",
    file: "src/types/user.ts",
    line: 8,
    column: 12,
    visibility: "public",
    description: "Enumeration of user roles in the system",
    exports: true,
    usages: [
      { file: "src/components/RoleGuard.tsx", line: 12, column: 25, context: "role: UserRole" },
      { file: "src/hooks/usePermissions.ts", line: 15, column: 30, context: "user.role === UserRole.ADMIN" },
    ],
  },
]

function getSymbolIcon(type: Symbol["type"]) {
  switch (type) {
    case "function":
      return <Function className="h-4 w-4 text-blue-400" />
    case "class":
      return <Code className="h-4 w-4 text-green-400" />
    case "interface":
    case "type":
      return <Type className="h-4 w-4 text-purple-400" />
    case "variable":
    case "constant":
      return <Variable className="h-4 w-4 text-orange-400" />
    case "enum":
      return <FileText className="h-4 w-4 text-pink-400" />
    default:
      return <Code className="h-4 w-4 text-muted-foreground" />
  }
}

function getVisibilityColor(visibility: Symbol["visibility"]) {
  switch (visibility) {
    case "public":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "private":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case "protected":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case "internal":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function SymbolCard({ symbol }: { symbol: Symbol }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showUsages, setShowUsages] = useState(false)

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getSymbolIcon(symbol.type)}
            <div>
              <CardTitle className="text-base font-mono">{symbol.name}</CardTitle>
              <CardDescription className="text-sm">
                {symbol.file}:{symbol.line}:{symbol.column}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getVisibilityColor(symbol.visibility)}>{symbol.visibility}</Badge>
            <Badge variant="outline" className="text-xs">
              {symbol.type}
            </Badge>
            {symbol.exports && (
              <Badge variant="outline" className="text-xs text-green-400 border-green-400/20">
                Exported
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {symbol.description && <p className="text-sm text-muted-foreground">{symbol.description}</p>}

          {/* Function signature */}
          {symbol.type === "function" && symbol.parameters && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="font-mono text-sm">
                <span className="text-blue-400">{symbol.name}</span>
                <span className="text-muted-foreground">(</span>
                {symbol.parameters.map((param, index) => (
                  <span key={param.name}>
                    <span className="text-orange-400">{param.name}</span>
                    {param.optional && <span className="text-muted-foreground">?</span>}
                    <span className="text-muted-foreground">: </span>
                    <span className="text-purple-400">{param.type}</span>
                    {param.defaultValue && (
                      <>
                        <span className="text-muted-foreground"> = </span>
                        <span className="text-green-400">{param.defaultValue}</span>
                      </>
                    )}
                    {index < symbol.parameters.length - 1 && <span className="text-muted-foreground">, </span>}
                  </span>
                ))}
                <span className="text-muted-foreground">)</span>
                {symbol.returnType && (
                  <>
                    <span className="text-muted-foreground">: </span>
                    <span className="text-purple-400">{symbol.returnType}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Usages */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUsages(!showUsages)}
              className="h-6 px-0 text-xs text-muted-foreground hover:text-foreground"
            >
              {showUsages ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  Hide usages
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  Show {symbol.usages.length} usage{symbol.usages.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>

          {showUsages && (
            <div className="space-y-2">
              {symbol.usages.map((usage, index) => (
                <div key={index} className="bg-muted/30 p-2 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-muted-foreground">
                      {usage.file}:{usage.line}:{usage.column}
                    </span>
                  </div>
                  <code className="text-foreground bg-background px-2 py-1 rounded text-xs block">{usage.context}</code>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function SymbolExplorer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | Symbol["type"]>("all")
  const [filterVisibility, setFilterVisibility] = useState<"all" | Symbol["visibility"]>("all")
  const [showExportsOnly, setShowExportsOnly] = useState(false)

  const filteredSymbols = mockSymbols.filter((symbol) => {
    const matchesSearch =
      symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || symbol.type === filterType
    const matchesVisibility = filterVisibility === "all" || symbol.visibility === filterVisibility
    const matchesExports = !showExportsOnly || symbol.exports

    return matchesSearch && matchesType && matchesVisibility && matchesExports
  })

  const stats = {
    total: mockSymbols.length,
    functions: mockSymbols.filter((s) => s.type === "function").length,
    classes: mockSymbols.filter((s) => s.type === "class").length,
    interfaces: mockSymbols.filter((s) => s.type === "interface" || s.type === "type").length,
    variables: mockSymbols.filter((s) => s.type === "variable" || s.type === "constant").length,
    exported: mockSymbols.filter((s) => s.exports).length,
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.functions}</div>
            <div className="text-sm text-muted-foreground">Functions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.classes}</div>
            <div className="text-sm text-muted-foreground">Classes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.interfaces}</div>
            <div className="text-sm text-muted-foreground">Types</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.variables}</div>
            <div className="text-sm text-muted-foreground">Variables</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-5">{stats.exported}</div>
            <div className="text-sm text-muted-foreground">Exported</div>
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
          <div className="space-y-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search symbols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Type:</span>
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  All
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
                <Button
                  variant={filterType === "interface" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("interface")}
                >
                  Types
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Visibility:</span>
                <Button
                  variant={filterVisibility === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterVisibility("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterVisibility === "public" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterVisibility("public")}
                >
                  Public
                </Button>
                <Button
                  variant={filterVisibility === "private" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterVisibility("private")}
                >
                  Private
                </Button>
              </div>

              <Button
                variant={showExportsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowExportsOnly(!showExportsOnly)}
              >
                Exported Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Symbols List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSymbols.map((symbol, index) => (
          <SymbolCard key={`${symbol.file}-${symbol.name}-${index}`} symbol={symbol} />
        ))}
      </div>

      {filteredSymbols.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No symbols match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
