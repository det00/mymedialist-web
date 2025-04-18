"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Esperar a que el componente se monte para evitar errores de hidratación
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  // No renderizar el switch hasta que el componente esté montado
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Sun className="h-[1.2rem] w-[1.2rem] text-gray-400" />
        <div className="h-[24px] w-[44px] bg-gray-300 rounded-full"></div>
        <Moon className="h-[1.2rem] w-[1.2rem] text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-[1.2rem] w-[1.2rem] dark:text-gray-400 text-yellow-500" />
      <Switch 
        checked={resolvedTheme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-[1.2rem] w-[1.2rem] dark:text-blue-300 text-gray-400" />
    </div>
  )
}