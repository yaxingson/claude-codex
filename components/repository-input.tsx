"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, Search, Github } from "lucide-react"

interface RepositoryInputProps {
  onAnalyze: (repoUrl: string) => void
  isAnalyzing: boolean
}

export function RepositoryInput({ onAnalyze, isAnalyzing }: RepositoryInputProps) {
  const [repoUrl, setRepoUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (repoUrl.trim()) {
      onAnalyze(repoUrl.trim())
    }
  }

  const exampleRepos = [
    "https://github.com/vercel/next.js",
    "https://github.com/facebook/react",
    "https://github.com/microsoft/vscode",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          Repository URL
        </CardTitle>
        <CardDescription>Enter a GitHub repository URL to start the analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1"
              disabled={isAnalyzing}
            />
            <Button type="submit" disabled={!repoUrl.trim() || isAnalyzing} className="px-6">
              {isAnalyzing ? (
                <>
                  <Search className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-3">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleRepos.map((repo) => (
              <Button
                key={repo}
                variant="outline"
                size="sm"
                onClick={() => setRepoUrl(repo)}
                disabled={isAnalyzing}
                className="text-xs"
              >
                {repo.split("/").slice(-2).join("/")}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
