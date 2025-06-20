"use client"

import { useState, useEffect } from "react"

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem("qq-theme")
    if (savedTheme) {
      const isDark = savedTheme === "dark"
      setIsDarkMode(isDark)
      document.documentElement.classList.toggle("dark", isDark)
    } else {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
      localStorage.setItem("qq-theme", "dark")
    }
  }, [])

  const toggleTheme = (): void => {
    const newIsDarkMode = !isDarkMode
    setIsDarkMode(newIsDarkMode)
    document.documentElement.classList.toggle("dark", newIsDarkMode)
    localStorage.setItem("qq-theme", newIsDarkMode ? "dark" : "light")
  }

  return {
    isDarkMode,
    toggleTheme,
  }
}
