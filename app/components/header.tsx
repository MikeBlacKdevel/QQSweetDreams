"use client"

import { Menu, Sun, Moon, Lock } from "lucide-react"

interface HeaderProps {
  isDarkMode: boolean
  isAuthenticated: boolean
  isPending: boolean
  onToggleTheme: () => void
  onToggleSidebar: () => void
  onAuthClick: () => void
}

export default function Header({
  isDarkMode,
  isAuthenticated,
  isPending,
  onToggleTheme,
  onToggleSidebar,
  onAuthClick,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 glow-hover"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <h1 className="ml-2 sm:ml-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
              QQ's Sweet Dreams
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 glow-hover"
              aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
            <button
              onClick={onAuthClick}
              className="inline-flex items-center px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 btn-glow"
              disabled={isPending}
            >
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{isAuthenticated ? "Cerrar sesión" : "Admin"}</span>
              <span className="sm:hidden">{isAuthenticated ? "Salir" : "Admin"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
