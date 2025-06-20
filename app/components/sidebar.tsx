"use client"

import {
  X,
  BarChart3,
  Target,
  Users,
  Heart,
  AlertTriangle,
  HelpCircle,
  FileText,
  Plus,
  Award,
  Clock,
  Settings,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  activeSection: string
  isAuthenticated: boolean
  onClose: () => void
  onSectionChange: (section: string) => void
  onModalOpen: (modal: string) => void
}

const menuItems = [
  { id: "leaderboard", label: "Clasificación", icon: BarChart3 },
  { id: "betting", label: "Apuestas", icon: Target },
  { id: "rivals", label: "RIVALS", icon: Users },
  { id: "qq-mejor", label: "Para un QQ mejor", icon: Heart },
  { id: "penalizations", label: "Penalizaciones", icon: AlertTriangle },
]

const infoItems = [
  { id: "how-it-works", label: "¿Cómo funciona?", icon: HelpCircle },
  { id: "rules", label: "Normas", icon: FileText },
]

const adminItems = [
  { id: "add-user", label: "Agregar Usuario", icon: Plus },
  { id: "add-award", label: "Agregar Premio", icon: Award },
  { id: "add-hour", label: "Agregar Hora", icon: Clock },
  { id: "adjust-points", label: "Ajustar Puntos", icon: Settings, color: "text-blue-700 dark:text-blue-400" },
  { id: "qq-mejor-award", label: "Premio QQ Mejor", icon: Heart, color: "text-green-700 dark:text-green-400" },
  {
    id: "penalization-award",
    label: "Aplicar Penalización",
    icon: AlertTriangle,
    color: "text-red-700 dark:text-red-400",
  },
  { id: "manage-bets", label: "Gestionar Apuestas", icon: Settings },
  { id: "manage-rivals", label: "Gestionar RIVALS", icon: Settings },
]

export default function Sidebar({
  isOpen,
  activeSection,
  isAuthenticated,
  onClose,
  onSectionChange,
  onModalOpen,
}: SidebarProps) {
  const handleItemClick = (id: string, isModal = false) => {
    if (isModal) {
      onModalOpen(id)
    } else {
      onSectionChange(id)
    }
    onClose()
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} aria-hidden="true" />}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white dark:bg-gray-900 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menú</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 sm:mt-6 px-3 pb-4 overflow-y-auto h-full">
          {/* Main Navigation */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 sm:py-2 text-sm font-medium rounded-md transition-colors duration-200 sidebar-item ${
                    activeSection === item.id
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Information Section */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              {infoItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id, true)}
                    className="w-full flex items-center px-3 py-2.5 sm:py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Admin Section */}
          {isAuthenticated && (
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="px-3 mb-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Administración
                </p>
              </div>
              <div className="space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        console.log(`Admin button clicked: ${item.id}`) // Debug log
                        handleItemClick(item.id, true)
                      }}
                      className={`w-full flex items-center px-3 py-2.5 sm:py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        item.color || "text-gray-700 dark:text-gray-200"
                      } hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
                    >
                      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}
