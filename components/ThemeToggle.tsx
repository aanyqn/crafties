"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Render placeholder dulu agar tidak layout shift saat SSR
  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-full transition-colors
                 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900
                 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
    >
      {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}