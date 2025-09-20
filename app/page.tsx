"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GitBranch, Folder, FileText, Package, Network, Search, Download, Eye } from "lucide-react"
import { RepositoryInput } from "@/components/repository-input"
import { DirectoryTree } from "@/components/directory-tree"
import { DependencyGraph } from "@/components/dependency-graph"
import { SymbolExplorer } from "@/components/symbol-explorer"
import { RelationshipViewer } from "@/components/relationship-viewer"

export default function CodeAnalyzer() {
  const [repository, setRepository] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  const handleAnalyze = async (repoUrl: string) => {
    setIsAnalyzing(true)
    setRepository(repoUrl)

    // Simulate analysis process
    setTimeout(() => {
      setAnalysisData({
        repository: repoUrl,
        stats: {
          files: 247,
          directories: 42,
          dependencies: 18,
          symbols: 1834,
          relationships: 456,
        },
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <GitBranch className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Code Analyzer</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                Powered by Claude
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Examples
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!analysisData ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Analyze GitHub Repository</h2>
              <p className="text-muted-foreground text-lg">
                {"Enter a GitHub repository URL to analyze its structure, dependencies, and code relationships"}
              </p>
            </div>

            <RepositoryInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

            {isAnalyzing && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 animate-spin" />
                    Analyzing Repository
                  </CardTitle>
                  <CardDescription>{"Extracting code structure and relationships..."}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Cloning repository...</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Analyzing file structure...</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Extracting symbols...</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Repository Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      {repository.split("/").slice(-2).join("/")}
                    </CardTitle>
                    <CardDescription>Analysis completed • {new Date().toLocaleString()}</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setAnalysisData(null)}>
                    Analyze New Repository
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{analysisData.stats.files}</div>
                    <div className="text-sm text-muted-foreground">Files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-2">{analysisData.stats.directories}</div>
                    <div className="text-sm text-muted-foreground">Directories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-3">{analysisData.stats.dependencies}</div>
                    <div className="text-sm text-muted-foreground">Dependencies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-4">{analysisData.stats.symbols}</div>
                    <div className="text-sm text-muted-foreground">Symbols</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-5">{analysisData.stats.relationships}</div>
                    <div className="text-sm text-muted-foreground">Relationships</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Directory Structure
                </TabsTrigger>
                <TabsTrigger value="dependencies" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Dependencies
                </TabsTrigger>
                <TabsTrigger value="symbols" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Symbols
                </TabsTrigger>
                <TabsTrigger value="relationships" className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Relationships
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <DirectoryTree />
              </TabsContent>

              <TabsContent value="dependencies" className="mt-6">
                <DependencyGraph />
              </TabsContent>

              <TabsContent value="symbols" className="mt-6">
                <SymbolExplorer />
              </TabsContent>

              <TabsContent value="relationships" className="mt-6">
                <RelationshipViewer />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
