"use client"

import type React from "react"
import { useState, useEffect, useCallback, useTransition, lazy, Suspense } from "react"
import { addUser, updateUser, deleteUser } from "./actions"

// Components - Critical components loaded immediately
import Header from "./components/header"
import Sidebar from "./components/sidebar"
import Leaderboard from "./components/leaderboard"
import Modal from "./components/modal"

// Lazy load non-critical components
const Betting = lazy(() => import("./components/betting"))
const Rivals = lazy(() => import("./components/rivals"))
const QQMejor = lazy(() => import("./components/qq-mejor"))
const Penalizations = lazy(() => import("./components/penalizations"))

// Hooks and utilities
import { useAuth } from "./hooks/useAuth"
import { useTheme } from "./hooks/useTheme"
import { getTotalPoints, getHoraMedia } from "./utils/calculations"
import { INITIAL_TIME, AWARD_TYPES } from "./types"

// Types
import type { User, Bet, Props } from "./types"

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
)

export default function MarcadorClient({
  initialUsers,
  initialBets,
  initialQQMejorAwards,
  initialPenalizations,
}: Props) {
  // ============================================================================
  // HOOKS Y ESTADO PRINCIPAL
  // ============================================================================
  const [users, setUsers] = useState(initialUsers)
  const [bets, setBets] = useState(initialBets)
  const [qqMejorAwards, setQQMejorAwards] = useState(initialQQMejorAwards)
  const [penalizations, setPenalizations] = useState(initialPenalizations)
  const [isPending, startTransition] = useTransition()
  const [isMobile, setIsMobile] = useState(false)

  const { isAuthenticated, password, setPassword, handleAuth, handleLogout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  // ============================================================================
  // ESTADO DE NAVEGACIÓN Y MODALES
  // ============================================================================
  const [activeSection, setActiveSection] = useState("leaderboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingBet, setEditingBet] = useState<Bet | null>(null)

  // Estados de modales
  const [modals, setModals] = useState({
    addUser: false,
    addAward: false,
    addHour: false,
    bet: false,
    rivals: false,
    qqMejorAward: false,
    penalizationAward: false,
    howItWorks: false,
    rules: false,
    qqMejor: false,
    penalizations: false,
    rivalsHowItWorks: false,
    manageBets: false,
    manageRivals: false,
  })

  // Estados de formularios
  const [formData, setFormData] = useState({
    // User form
    userName: "",
    userWhatsapp: "",
    userTrophies: 0,
    userGoldMedals: 0,
    userSilverMedals: 0,
    userBronzeMedals: 0,
    userPoints: 0,
    // Award form
    copaUserId: "",
    copaTipo: AWARD_TYPES.COPA,
    copaHora: INITIAL_TIME,
    // Hour form
    horaUserId: "",
    horaValue: INITIAL_TIME,
    // Bet form
    bettorName: "",
    predictedWinner: "",
    betStatus: "pending",
    betPoints: 0,
    // Rivals form
    rivalsBettorName: "",
    rivalsTarget: "",
    // QQ Mejor form
    qqMejorUserId: "",
    qqMejorDescription: "",
    qqMejorPoints: 0,
    // Penalization form
    penalizationUserId: "",
    penalizationDescription: "",
    penalizationPoints: 0,
    penalizationAdminName: "",
  })

  // ============================================================================
  // EFECTOS
  // ============================================================================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // ============================================================================
  // FUNCIONES UTILITARIAS
  // ============================================================================
  const openModal = useCallback((modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: true }))
    setIsSidebarOpen(false)
  }, [])

  const closeModal = useCallback((modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: false }))
  }, [])

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetFormData = useCallback(() => {
    setFormData({
      userName: "",
      userWhatsapp: "",
      userTrophies: 0,
      userGoldMedals: 0,
      userSilverMedals: 0,
      userBronzeMedals: 0,
      userPoints: 0,
      copaUserId: "",
      copaTipo: AWARD_TYPES.COPA,
      copaHora: INITIAL_TIME,
      horaUserId: "",
      horaValue: INITIAL_TIME,
      bettorName: "",
      predictedWinner: "",
      betStatus: "pending",
      betPoints: 0,
      rivalsBettorName: "",
      rivalsTarget: "",
      qqMejorUserId: "",
      qqMejorDescription: "",
      qqMejorPoints: 0,
      penalizationUserId: "",
      penalizationDescription: "",
      penalizationPoints: 0,
      penalizationAdminName: "",
    })
  }, [])

  // ============================================================================
  // MANEJADORES DE EVENTOS (Simplified for performance)
  // ============================================================================
  const handleAuthSubmit = useCallback(() => {
    if (handleAuth()) {
      setIsAuthOpen(false)
    } else {
      alert("Contraseña incorrecta")
    }
  }, [handleAuth])

  const handleAuthClick = useCallback(() => {
    if (isAuthenticated) {
      handleLogout()
    } else {
      setIsAuthOpen(true)
    }
  }, [isAuthenticated, handleLogout])

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section)
    setIsSidebarOpen(false)
  }, [])

  const handleModalOpen = useCallback(
    (modalName: string) => {
      const modalMappings: { [key: string]: string } = {
        "add-user": "addUser",
        "add-award": "addAward",
        "add-hour": "addHour",
        "qq-mejor-award": "qqMejorAward",
        "penalization-award": "penalizationAward",
        "manage-bets": "manageBets",
        "manage-rivals": "manageRivals",
        "how-it-works": "howItWorks",
        rules: "rules",
        "qq-mejor": "qqMejor",
        penalizations: "penalizations",
        "rivals-how-it-works": "rivalsHowItWorks",
      }

      const modalKey = modalMappings[modalName] || modalName
      openModal(modalKey)
    },
    [openModal],
  )

  // Simplified handlers for better performance
  const handleEditUser = useCallback(
    (user: User) => {
      setEditingUser(user)
      updateFormData({
        userName: user.name,
        userWhatsapp: user.whatsapp,
        userTrophies: user.trophies,
        userGoldMedals: user.gold_medals,
        userSilverMedals: user.silver_medals,
        userBronzeMedals: user.bronze_medals,
        userPoints: user.points,
      })
      openModal("addUser")
    },
    [updateFormData, openModal],
  )

  const handleAddUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!formData.userName.trim() || !formData.userWhatsapp.trim()) return

      const data = new FormData()
      if (editingUser) {
        data.append("id", editingUser.id.toString())
      }
      data.append("name", formData.userName.trim())
      data.append("whatsapp", formData.userWhatsapp.trim())
      data.append("trophies", formData.userTrophies.toString())
      data.append("goldMedals", formData.userGoldMedals.toString())
      data.append("silverMedals", formData.userSilverMedals.toString())
      data.append("bronzeMedals", formData.userBronzeMedals.toString())
      data.append("points", formData.userPoints.toString())

      startTransition(async () => {
        const result = editingUser ? await updateUser(data) : await addUser(data)
        if (result.success) {
          resetFormData()
          setEditingUser(null)
          closeModal("addUser")
          window.location.reload()
        } else {
          alert(result.error)
        }
      })
    },
    [formData, editingUser, resetFormData, closeModal, startTransition],
  )

  const handleDeleteUser = useCallback(
    async (id: number) => {
      if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return

      startTransition(async () => {
        const result = await deleteUser(id)
        if (result.success) {
          window.location.reload()
        } else {
          alert(result.error)
        }
      })
    },
    [startTransition],
  )

  // ============================================================================
  // RENDERIZADO DE CONTENIDO
  // ============================================================================
  const renderContent = () => {
    switch (activeSection) {
      case "betting":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Betting
              bets={bets}
              users={users}
              isAuthenticated={isAuthenticated}
              isPending={isPending}
              onOpenBet={() => openModal("bet")}
              onManageBets={() => openModal("manageBets")}
              getTotalPoints={getTotalPoints}
            />
          </Suspense>
        )
      case "rivals":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Rivals
              bets={bets}
              users={users}
              isAuthenticated={isAuthenticated}
              isPending={isPending}
              onOpenRivals={() => openModal("rivals")}
              onRivalsHowItWorks={() => openModal("rivalsHowItWorks")}
              onManageRivals={() => openModal("manageRivals")}
              getTotalPoints={getTotalPoints}
            />
          </Suspense>
        )
      case "qq-mejor":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <QQMejor
              qqMejorAwards={qqMejorAwards}
              isAuthenticated={isAuthenticated}
              onOpenQQMejor={() => openModal("qqMejor")}
              onQQMejorAward={() => openModal("qqMejorAward")}
            />
          </Suspense>
        )
      case "penalizations":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Penalizations
              penalizations={penalizations}
              isAuthenticated={isAuthenticated}
              onOpenPenalizations={() => openModal("penalizations")}
              onPenalizationAward={() => openModal("penalizationAward")}
            />
          </Suspense>
        )
      default:
        return (
          <Leaderboard
            users={users}
            isAuthenticated={isAuthenticated}
            isPending={isPending}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onAddUser={() => openModal("addUser")}
            getTotalPoints={getTotalPoints}
            getHoraMedia={getHoraMedia}
          />
        )
    }
  }

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Reduced animated particles background */}
      <div className="particles-container">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          activeSection={activeSection}
          isAuthenticated={isAuthenticated}
          onClose={() => setIsSidebarOpen(false)}
          onSectionChange={handleSectionChange}
          onModalOpen={handleModalOpen}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            isDarkMode={isDarkMode}
            isAuthenticated={isAuthenticated}
            isPending={isPending}
            onToggleTheme={toggleTheme}
            onToggleSidebar={() => setIsSidebarOpen(true)}
            onAuthClick={handleAuthClick}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
              {renderContent()}

              {/* Premio oculto */}
              <div className="mt-8 sm:mt-12 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    🎁 En esta web se oculta una manera donde puedes ganar 50 puntos directamente, así que los ojos
                    abiertos. Pedir una pista te cuesta 1 punto.
                  </p>
                </div>
              </div>

              {/* Aviso de transparencia */}
              <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
                <div className="text-center">
                  <h4 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-400 mb-4 flex items-center justify-center gap-2">
                    <span className="text-lg">🔍</span>
                    TRANSPARENCIA
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Esta página no guarda ningún tipo de registro, puedes usar tus extensiones para rastrear, NO guarda
                    IPS, no guarda absolutamente nada que no esté puesto por el juego. Para poder ver el código y hacer
                    vuestras propias comprobaciones (psst... o usarlo para encontrar los premios 50p) Todo está en{" "}
                    <a
                      href="https://github.com/MikeBlacKdevel/QQSweetDreams"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-400 underline font-medium"
                    >
                      https://github.com/MikeBlacKdevel/QQSweetDreams
                    </a>
                  </p>
                  <div className="w-12 h-px bg-green-300 dark:bg-green-700 mx-auto mb-4"></div>
                  <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">
                    El premio a final de temporada va a ser otorgado por Pedro Llanes o colaboradores, pero será
                    interesante.
                  </p>
                  <div className="mt-4 text-xs text-blue-600 dark:text-blue-400 font-mono">
                    💡 Optimizado para máximo rendimiento - Carga rápida garantizada
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modales - Solo los críticos cargados inmediatamente */}
      <Modal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} title="Autenticación">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-glow"
              onKeyDown={(e) => e.key === "Enter" && handleAuthSubmit()}
              disabled={isPending}
              placeholder="Contraseña"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAuthSubmit}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setIsAuthOpen(false)
                setPassword("")
              }}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Agregar/Editar Usuario */}
      <Modal
        isOpen={modals.addUser}
        onClose={() => {
          setEditingUser(null)
          resetFormData()
          closeModal("addUser")
        }}
        title={editingUser ? "Editar Usuario" : "Agregar Usuario"}
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nombre</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => updateFormData({ userName: (e.target as HTMLInputElement).value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-glow"
              required
              disabled={isPending}
              placeholder="Nombre del usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">WhatsApp</label>
            <input
              type="text"
              value={formData.userWhatsapp}
              onChange={(e) => updateFormData({ userWhatsapp: (e.target as HTMLInputElement).value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-glow"
              required
              disabled={isPending}
              placeholder="Número de WhatsApp"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Copas</label>
              <input
                type="number"
                value={formData.userTrophies}
                onChange={(e) => updateFormData({ userTrophies: Number((e.target as HTMLInputElement).value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-glow"
                min="0"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Oro</label>
              <input
                type="number"
                value={formData.userGoldMedals}
                onChange={(e) => updateFormData({ userGoldMedals: Number((e.target as HTMLInputElement).value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-glow"
                min="0"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Plata</label>
              <input
                type="number"
                value={formData.userSilverMedals}
                onChange={(e) =>
                  updateFormData({ userSilverMedals: Number((e.target as HTMLInputElement).value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-glow"
                min="0"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Bronce</label>
              <input
                type="number"
                value={formData.userBronzeMedals}
                onChange={(e) =>
                  updateFormData({ userBronzeMedals: Number((e.target as HTMLInputElement).value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-glow"
                min="0"
                disabled={isPending}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Puntos Extra</label>
            <input
              type="number"
              value={formData.userPoints}
              onChange={(e) => updateFormData({ userPoints: Number((e.target as HTMLInputElement).value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-glow"
              min="0"
              disabled={isPending}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 btn-glow"
              disabled={isPending}
            >
              {editingUser ? "Actualizar" : "Agregar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingUser(null)
                resetFormData()
                closeModal("addUser")
              }}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal ¿Cómo funciona? */}
      <Modal isOpen={modals.howItWorks} onClose={() => closeModal("howItWorks")} title="¿Cómo funciona?" maxWidth="2xl">
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">🏆 Sistema de Competición</h3>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              QQ's Sweet Dreams es una competición donde los participantes compiten por conseguir la mejor hora de
              sueño.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl">🏆</span>
                <div>
                  <strong className="text-blue-900 dark:text-blue-100">Copa (10 pts):</strong>
                  <span className="text-blue-800 dark:text-blue-200 ml-2">Mejor hora del día</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">🥇</span>
                <div>
                  <strong className="text-blue-900 dark:text-blue-100">Oro (5 pts):</strong>
                  <span className="text-blue-800 dark:text-blue-200 ml-2">Segunda mejor hora</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-400 text-xl">🥈</span>
                <div>
                  <strong className="text-blue-900 dark:text-blue-100">Plata (3 pts):</strong>
                  <span className="text-blue-800 dark:text-blue-200 ml-2">Tercera mejor hora</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-600 text-xl">🥉</span>
                <div>
                  <strong className="text-blue-900 dark:text-blue-100">Bronce (1 pt):</strong>
                  <span className="text-blue-800 dark:text-blue-200 ml-2">Cuarta mejor hora</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">🎯 Apuestas</h3>
            <div className="space-y-3">
              <div>
                <strong className="text-green-900 dark:text-green-100">Apuestas normales:</strong>
                <ul className="list-disc list-inside text-green-800 dark:text-green-200 ml-4 mt-1">
                  <li>Acierto: +10 puntos</li>
                  <li>Error: -5 puntos</li>
                  <li>Auto-predicción (ganar): +20 puntos</li>
                  <li>Auto-predicción (perder): -10 puntos</li>
                </ul>
              </div>
              <div>
                <strong className="text-green-900 dark:text-green-100">RIVALS:</strong>
                <ul className="list-disc list-inside text-green-800 dark:text-green-200 ml-4 mt-1">
                  <li>Apuesta contra quien NO ganará</li>
                  <li>Solo contra usuarios con puntos activos</li>
                  <li>Mismas reglas de puntuación</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">💝 Premios Especiales</h3>
            <div className="space-y-2">
              <div>
                <strong className="text-purple-900 dark:text-purple-100">QQ Mejor:</strong>
                <span className="text-purple-800 dark:text-purple-200 ml-2">
                  Premios por buenas acciones que fortalezcan la comunidad
                </span>
              </div>
              <div>
                <strong className="text-purple-900 dark:text-purple-100">Premio Oculto:</strong>
                <span className="text-purple-800 dark:text-purple-200 ml-2">50 puntos escondidos en la web</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Normas */}
      <Modal isOpen={modals.rules} onClose={() => closeModal("rules")} title="Normas de la Competición" maxWidth="2xl">
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">⚠️ Regla Principal</h3>
            <p className="text-red-800 dark:text-red-200 text-center font-medium">
              <strong>Solo cuenta si has dormido. Pedro decide el premio.</strong>
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">📋 Normas Generales</h3>
            <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Las horas deben ser reales y verificables</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>No se permiten horas falsas o manipuladas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Los administradores pueden verificar las horas en cualquier momento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Las decisiones de los administradores son finales</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">🎯 Normas de Apuestas</h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Las apuestas deben realizarse antes de las 23:59 del día anterior</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>No se pueden cambiar las apuestas una vez realizadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Las auto-predicciones tienen mayor riesgo y recompensa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>RIVALS solo permite apostar contra usuarios activos</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">👮 Administración</h3>
            <div className="space-y-2 text-green-800 dark:text-green-200">
              <p>
                <strong>Administradores autorizados:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Pedro Llanes (Administrador Principal)</li>
                <li>Vince (Administrador)</li>
                <li>Otros administradores designados</li>
              </ul>
              <p className="mt-3">
                <strong>Los administradores pueden:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Otorgar premios QQ Mejor</li>
                <li>Aplicar penalizaciones</li>
                <li>Verificar horas de sueño</li>
                <li>Resolver disputas</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">🏆 Premio Final</h3>
            <p className="text-purple-800 dark:text-purple-200 text-center">
              El premio al final de la temporada será otorgado por Pedro Llanes o colaboradores, y será interesante.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal QQ Mejor Ejemplos */}
      <Modal
        isOpen={modals.qqMejor}
        onClose={() => closeModal("qqMejor")}
        title="Ejemplos de Buenas Acciones QQ Mejor"
        maxWidth="2xl"
      >
        <div className="space-y-6">
          <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100 mb-3 flex items-center gap-2">
              <span>💝</span> Ayuda y Colaboración
            </h3>
            <ul className="space-y-2 text-pink-800 dark:text-pink-200">
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span>Ayudar a otros miembros con problemas técnicos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span>Compartir recursos útiles para mejorar el sueño</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span>Organizar actividades grupales beneficiosas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">•</span>
                <span>Mediar en conflictos de manera constructiva</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <span>🌟</span> Participación Activa
            </h3>
            <ul className="space-y-2 text-purple-800 dark:text-purple-200">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Contribuir con ideas para mejorar la competición</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Animar y motivar a otros participantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Crear contenido divertido relacionado con QQ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Mantener un ambiente positivo en el grupo</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <span>🤝</span> Espíritu Comunitario
            </h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Dar la bienvenida a nuevos miembros</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Compartir experiencias y consejos de sueño</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Celebrar los logros de otros participantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Reportar problemas de manera constructiva</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
              <span>🏦</span> Nota Importante
            </h3>
            <p className="text-yellow-800 dark:text-yellow-200">
              Los premios QQ Mejor son determinados por la administración según el impacto positivo de la acción en la
              comunidad. Los puntos pueden variar entre 5 y 50 según la magnitud y beneficio de la contribución.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal Penalizaciones Ejemplos */}
      <Modal
        isOpen={modals.penalizations}
        onClose={() => closeModal("penalizations")}
        title="Comportamientos Penalizables"
        maxWidth="2xl"
      >
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
              <span>🚫</span> Comportamiento Tóxico
            </h3>
            <ul className="space-y-2 text-red-800 dark:text-red-200">
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>Insultos o faltas de respeto hacia otros miembros</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>Acoso o intimidación a participantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>Discriminación por cualquier motivo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>Crear conflictos innecesarios o drama</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <span>📱</span> Mal Uso del Grupo
            </h3>
            <ul className="space-y-2 text-orange-800 dark:text-orange-200">
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Spam o mensajes repetitivos innecesarios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Compartir contenido inapropiado o ofensivo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Uso excesivo de mayúsculas o emojis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Desviar constantemente las conversaciones del tema</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
              <span>⚖️</span> Trampas y Deshonestidad
            </h3>
            <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Falsificar horas de sueño</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Manipular el sistema de puntuación</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Crear cuentas falsas o duplicadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Colusión en las apuestas</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <span>👮</span> Proceso de Penalización
            </h3>
            <div className="space-y-2 text-blue-800 dark:text-blue-200">
              <p>
                <strong>Administradores autorizados:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Pedro Llanes</li>
                <li>Vince</li>
                <li>Otros administradores designados</li>
              </ul>
              <p className="mt-3">
                <strong>Proceso:</strong>
              </p>
              <ol className="list-decimal list-inside ml-4">
                <li>Evaluación del comportamiento</li>
                <li>Determinación de la penalización (5-50 puntos)</li>
                <li>Aplicación con justificación</li>
                <li>Registro en el historial</li>
              </ol>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal RIVALS Cómo Funciona */}
      <Modal
        isOpen={modals.rivalsHowItWorks}
        onClose={() => closeModal("rivalsHowItWorks")}
        title="¿Cómo funciona RIVALS?"
        maxWidth="2xl"
      >
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
              <span>⚔️</span> Concepto RIVALS
            </h3>
            <p className="text-red-800 dark:text-red-200 mb-4">
              RIVALS es una modalidad de apuesta donde apuestas <strong>CONTRA</strong> un usuario específico,
              prediciendo que NO ganará la copa o medalla de oro del día.
            </p>
            <div className="bg-red-100 dark:bg-red-800/30 rounded-lg p-3">
              <p className="text-red-900 dark:text-red-100 font-medium text-center">
                "Apuesto que [Usuario] NO ganará hoy"
              </p>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <span>📋</span> Reglas RIVALS
            </h3>
            <ul className="space-y-2 text-orange-800 dark:text-orange-200">
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Solo puedes apostar contra usuarios que ya tengan puntos activos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>No puedes apostar contra usuarios con 0 puntos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>La apuesta se resuelve según si el usuario gana copa/oro o no</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Mismas reglas de tiempo que las apuestas normales</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <span>🎯</span> Puntuación RIVALS
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-100 dark:bg-green-800/30 rounded-lg p-3">
                <div className="text-green-900 dark:text-green-100 font-semibold mb-1">✅ Acierto</div>
                <div className="text-green-800 dark:text-green-200 text-sm">El usuario NO gana copa/oro</div>
                <div className="text-green-700 dark:text-green-300 font-bold">+10 puntos</div>
              </div>
              <div className="bg-red-100 dark:bg-red-800/30 rounded-lg p-3">
                <div className="text-red-900 dark:text-red-100 font-semibold mb-1">❌ Error</div>
                <div className="text-red-800 dark:text-red-200 text-sm">El usuario SÍ gana copa/oro</div>
                <div className="text-red-700 dark:text-red-300 font-bold">-5 puntos</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <span>💡</span> Estrategia RIVALS
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Analiza el historial de horas del usuario objetivo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Considera su consistencia en horarios de sueño</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Evalúa la competencia del día</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Recuerda: es más fácil que alguien NO gane que sí gane</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <span>⚠️</span> Consideraciones Importantes
            </h3>
            <ul className="space-y-2 text-purple-800 dark:text-purple-200">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>RIVALS puede crear tensión - úsalo con deportividad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>No tomes las apuestas RIVALS como algo personal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Mantén el espíritu competitivo pero amistoso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Los administradores pueden intervenir si hay conflictos</span>
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  )
}
