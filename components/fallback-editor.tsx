"use client"

import { useEffect, useRef } from "react"

interface FallbackEditorProps {
  code: string
  onChange: (code: string) => void
  language?: string
  readOnly?: boolean
}

export function FallbackEditor({ code, onChange, language = "javascript", readOnly = false }: FallbackEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Ensure the textarea has the current code
    if (textareaRef.current && textareaRef.current.value !== code) {
      textareaRef.current.value = code
    }
  }, [code])

  return (
    <div className="w-full h-full min-h-[500px] relative bg-black text-white font-mono">
      <div className="absolute top-0 right-0 p-2 text-xs text-gray-400">{language}</div>
      <textarea
        ref={textareaRef}
        className="w-full h-full p-4 bg-black text-white font-mono resize-none outline-none border-none"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        data-author="Sai Rohith T"
      />
    </div>
  )
}

