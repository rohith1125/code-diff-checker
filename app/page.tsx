"use client"

/**
 * Code Diff Checker
 * A professional tool for comparing code snippets
 *
 * @author Sai Rohith T
 * @version 1.0.4
 */

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeftRight, Copy, Download, Github, Upload } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"
import { FallbackEditor } from "@/components/fallback-editor"

export default function CodeDiffPage() {
  const [originalCode, setOriginalCode] = useState<string>("")
  const [modifiedCode, setModifiedCode] = useState<string>("")
  const [language, setLanguage] = useState<string>("javascript")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [mounted, setMounted] = useState<boolean>(false)
  const { toast } = useToast()

  // Helper functions for the editor callbacks
  const onOriginalChange = useCallback((code: string) => {
    setOriginalCode(code)
  }, [])

  const onModifiedChange = useCallback((code: string) => {
    setModifiedCode(code)
  }, [])

  const handleCopyDiff = useCallback(() => {
    const diffText = `Original:\n${originalCode}\n\nModified:\n${modifiedCode}`
    navigator.clipboard.writeText(diffText)
    toast({
      title: "Copied to clipboard",
      description: "The diff has been copied to your clipboard",
    })
  }, [originalCode, modifiedCode, toast])

  const handleSwap = useCallback(() => {
    setOriginalCode((prevOriginal) => {
      setModifiedCode(prevOriginal)
      return modifiedCode
    })

    toast({
      title: "Swapped code",
      description: "Original and modified code have been swapped",
    })
  }, [modifiedCode, toast])

  const handleDownload = useCallback(() => {
    const diffText = `Original:\n${originalCode}\n\nModified:\n${modifiedCode}`
    const blob = new Blob([diffText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "code-diff.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded diff",
      description: "The diff has been downloaded as a text file",
    })
  }, [originalCode, modifiedCode, toast])

  const handleFileUpload = useCallback(
    (side: "original" | "modified") => {
      return () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".js,.jsx,.ts,.tsx,.html,.css,.json,.md,.py,.java,.c,.cpp,.go,.rs,.php"

        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (!file) return

          // Detect language from file extension
          const extension = file.name.split(".").pop()?.toLowerCase() || ""
          const languageMap: Record<string, string> = {
            js: "javascript",
            jsx: "javascript",
            ts: "typescript",
            tsx: "typescript",
            html: "html",
            css: "css",
            json: "json",
            md: "markdown",
            py: "python",
            java: "java",
            c: "c",
            cpp: "cpp",
            go: "go",
            rs: "rust",
            php: "php",
          }

          if (extension in languageMap) {
            setLanguage(languageMap[extension])
          }

          const reader = new FileReader()
          reader.onload = (event) => {
            const content = event.target?.result as string
            if (side === "original") {
              setOriginalCode(content)
            } else {
              setModifiedCode(content)
            }
            toast({
              title: "File loaded",
              description: `${file.name} loaded into ${side} editor`,
            })
          }
          reader.readAsText(file)
        }

        input.click()
      }
    },
    [toast],
  )

  // Only run on client-side
  useEffect(() => {
    setMounted(true)

    // Sample code for initial display
    setOriginalCode(`function greeting() {
  console.log("Hello world!");
  return true;
}

// This is the original code
const result = greeting();`)

    setModifiedCode(`function greeting() {
  console.log("Hello there!");
  return false;
}

// This is the modified code
const result = greeting();
console.log(result);`)

    setIsLoading(false)
  }, [])

  // If not mounted yet, show a loading state
  if (!mounted) {
    return (
      <div className="container mx-auto py-6 px-4 min-h-screen">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-full max-w-md mb-8" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  // Simple diff view component
  const SimpleDiffView = ({ original, modified }: { original: string; modified: string }) => {
    const originalLines = original.split("\n")
    const modifiedLines = modified.split("\n")

    // Create a simple diff view
    const diffLines: Array<{ type: "added" | "removed" | "unchanged"; content: string }> = []

    // Very simple diff algorithm
    const maxLines = Math.max(originalLines.length, modifiedLines.length)

    for (let i = 0; i < maxLines; i++) {
      const originalLine = i < originalLines.length ? originalLines[i] : null
      const modifiedLine = i < modifiedLines.length ? modifiedLines[i] : null

      if (originalLine === modifiedLine) {
        if (originalLine !== null) {
          diffLines.push({ type: "unchanged", content: originalLine })
        }
      } else {
        if (originalLine !== null) {
          diffLines.push({ type: "removed", content: originalLine })
        }
        if (modifiedLine !== null) {
          diffLines.push({ type: "added", content: modifiedLine })
        }
      }
    }

    return (
      <div className="w-full h-full overflow-auto bg-black text-white font-mono p-4">
        <div className="absolute top-0 right-0 p-2 text-xs text-gray-400">{language}</div>
        <pre className="whitespace-pre">
          {diffLines.map((line, index) => (
            <div
              key={index}
              className={
                line.type === "added"
                  ? "bg-green-900/30 text-green-300"
                  : line.type === "removed"
                    ? "bg-red-900/30 text-red-300"
                    : ""
              }
            >
              <span className="select-none mr-2">
                {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
              </span>
              {line.content}
            </div>
          ))}
        </pre>
        {/* Hidden signature */}
        <div style={{ display: "none" }} data-author="Sai Rohith T"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-6 px-4 flex-1">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Code Diff Checker</h1>
              <p className="text-muted-foreground mt-1">Compare two code snippets and visualize the differences</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyDiff}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleSwap}>
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Swap
              </Button>
              <a href="https://github.com/rohith1125/code-diff-checker" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </a>
            </div>
          </div>
        </header>

        <Tabs defaultValue="diff" className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="diff">Diff View</TabsTrigger>
              <TabsTrigger value="side">Side by Side</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <select
                className="bg-background border rounded px-2 py-1 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select programming language"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="php">PHP</option>
              </select>
            </div>
          </div>

          <TabsContent value="diff" className="flex-1 flex flex-col mt-0">
            <Card className="flex-1 flex flex-col overflow-hidden border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-muted border-b">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFileUpload("original")}
                    className="w-full justify-start"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Original
                  </Button>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFileUpload("modified")}
                    className="w-full justify-start"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Modified
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-[500px]">
                {!isLoading && mounted && <SimpleDiffView original={originalCode} modified={modifiedCode} />}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="side" className="flex-1 flex flex-col mt-0">
            <Card className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Original Code</h3>
                  <Button variant="ghost" size="sm" onClick={handleFileUpload("original")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <div className="flex-1 border rounded-md overflow-hidden min-h-[500px]">
                  {!isLoading && mounted && (
                    <FallbackEditor code={originalCode} onChange={onOriginalChange} language={language} />
                  )}
                </div>
              </div>

              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Modified Code</h3>
                  <Button variant="ghost" size="sm" onClick={handleFileUpload("modified")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <div className="flex-1 border rounded-md overflow-hidden min-h-[500px]">
                  {!isLoading && mounted && (
                    <FallbackEditor code={modifiedCode} onChange={onModifiedChange} language={language} />
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <Toaster />
    </div>
  )
}

