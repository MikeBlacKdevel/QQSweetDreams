"use client"

import { useState, useEffect } from "react"
import { ADMIN_PASSWORD } from "../types"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")

  useEffect(() => {
    const savedAuth = localStorage.getItem("qq-admin-session")
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        const now = Date.now()
        if (authData.expires > now) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem("qq-admin-session")
        }
      } catch (e) {
        localStorage.removeItem("qq-admin-session")
      }
    }
  }, [])

  const handleAuth = (): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPassword("")

      const authData = {
        authenticated: true,
        expires: Date.now() + 24 * 60 * 60 * 1000,
      }
      localStorage.setItem("qq-admin-session", JSON.stringify(authData))
      return true
    }
    return false
  }

  const handleLogout = (): void => {
    setIsAuthenticated(false)
    localStorage.removeItem("qq-admin-session")
  }

  return {
    isAuthenticated,
    password,
    setPassword,
    handleAuth,
    handleLogout,
  }
}
