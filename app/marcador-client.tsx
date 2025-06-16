"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Plus, Edit, Trash2, Trophy, Medal, MessageCircle, Lock, Clock, Award } from "lucide-react"
import { addUser, updateUser, deleteUser, addAward, addHour, addBet, updateBet, deleteBet } from "./actions"

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

interface Bet {
  id: number
  bettor_name: string
  predicted_winner: string
  bet_date: string
  status: string
  points_awarded: number
  created_at: string
}

interface User {
  id: number
  name: string
  whatsapp: string
  trophies: number
  gold_medals: number
  silver_medals: number
  bronze_medals: number
  points: number
  horas: string[]
}

interface Props {
  initialUsers: User[]
  initialBets: Bet[]
}

// ============================================================================
// CONSTANTES
// ============================================================================

const INITIAL_TIME = "08:00"
const ADMIN_PASSWORD = "qqcopas"
const AWARD_TYPES = {
  COPA: "copa",
  ORO: "oro",
  PLATA: "plata",
  BRONCE: "bronce",
} as const

const POINTS_SYSTEM = {
  COPA: 3,
  ORO: 2,
  PLATA: 1,
  BRONCE: 0.5,
} as const

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function MarcadorClient({ initialUsers, initialBets }: Props) {
  // ----------------------------------------------------------------------------
  // ESTADO PRINCIPAL
  // ----------------------------------------------------------------------------
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [bets, setBets] = useState<Bet[]>(initialBets)
  const [isPending, startTransition] = useTransition()

  // ----------------------------------------------------------------------------
  // ESTADO DE AUTENTICACIÓN
  // ----------------------------------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  // ----------------------------------------------------------------------------
  // ESTADO DE MODALES
  // ----------------------------------------------------------------------------
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddCopaOpen, setIsAddCopaOpen] = useState(false)
  const [isAddHoraOpen, setIsAddHoraOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)

  // ----------------------------------------------------------------------------
  // ESTADO DE APUESTAS
  // ----------------------------------------------------------------------------
  const [isBetOpen, setIsBetOpen] = useState(false)
  const [isManageBetsOpen, setIsManageBetsOpen] = useState(false)
  const [editingBet, setEditingBet] = useState<Bet | null>(null)

  // ----------------------------------------------------------------------------
  // ESTADO DE FORMULARIOS - PREMIOS
  // ----------------------------------------------------------------------------
  const [copaTipo, setCopaTipo] = useState(AWARD_TYPES.COPA)
  const [copaHora, setCopaHora] = useState(INITIAL_TIME)
  const [copaUserId, setCopaUserId] = useState("")

  // ----------------------------------------------------------------------------
  // ESTADO DE FORMULARIOS - HORAS
  // ----------------------------------------------------------------------------
  const [horaUserId, setHoraUserId] = useState("")
  const [horaValue, setHoraValue] = useState(INITIAL_TIME)

  // ----------------------------------------------------------------------------
  // ESTADO DE FORMULARIOS - APUESTAS
  // ----------------------------------------------------------------------------
  const [bettorName, setBettorName] = useState("")
  const [predictedWinner, setPredictedWinner] = useState("")
  const [betStatus, setBetStatus] = useState("pending")
  const [betPoints, setBetPoints] = useState(0)

  // ----------------------------------------------------------------------------
  // ESTADO DE FORMULARIOS - USUARIOS
  // ----------------------------------------------------------------------------
  const [userName, setUserName] = useState("")
  const [userWhatsapp, setUserWhatsapp] = useState("")
  const [userTrophies, setUserTrophies] = useState(0)
  const [userGoldMedals, setUserGoldMedals] = useState(0)
  const [userSilverMedals, setUserSilverMedals] = useState(0)
  const [userBronzeMedals, setUserBronzeMedals] = useState(0)
  const [userPoints, setUserPoints] = useState(0)

  // ============================================================================
  // FUNCIONES UTILITARIAS
  // ============================================================================

  /**
   * Calcula el total de puntos de un usuario basado en sus premios
   * Copa: 3pts, Oro: 2pts, Plata: 1pt, Bronce: 0.5pts
   */
  const getTotalPoints = (user: User): number => {
    return (
      user.trophies * POINTS_SYSTEM.COPA +
      user.gold_medals * POINTS_SYSTEM.ORO +
      user.silver_medals * POINTS_SYSTEM.PLATA +
      user.bronze_medals * POINTS_SYSTEM.BRONCE +
      user.points
    )
  }

  /**
   * Calcula la hora media de sueño de un usuario
   * Convierte las horas a minutos, calcula el promedio y lo convierte de vuelta
   */
  const getHoraMedia = (user: User): string => {
    if (!user.horas || user.horas.length === 0) return "N/A"

    try {
      const totalMinutes = user.horas.reduce((acc, hora) => {
        const [hours, minutes] = hora.split(":").map(Number)
        return acc + hours * 60 + minutes
      }, 0)

      const avgMinutes = totalMinutes / user.horas.length
      const avgHours = Math.floor(avgMinutes / 60)
      const avgMins = Math.round(avgMinutes % 60)

      return `${avgHours.toString().padStart(2, "0")}:${avgMins.toString().padStart(2, "0")}`
    } catch (e) {
      return "N/A"
    }
  }

  /**
   * Resetea todos los campos del formulario de usuario
   */
  const resetUserForm = (): void => {
    setUserName("")
    setUserWhatsapp("")
    setUserTrophies(0)
    setUserGoldMedals(0)
    setUserSilverMedals(0)
    setUserBronzeMedals(0)
    setUserPoints(0)
  }

  /**
   * Resetea todos los campos del formulario de premios
   */
  const resetCopaForm = (): void => {
    setCopaUserId("")
    setCopaTipo(AWARD_TYPES.COPA)
    setCopaHora(INITIAL_TIME)
  }

  /**
   * Resetea todos los campos del formulario de horas
   */
  const resetHoraForm = (): void => {
    setHoraUserId("")
    setHoraValue(INITIAL_TIME)
  }

  /**
   * Resetea todos los campos del formulario de apuestas
   */
  const resetBetForm = (): void => {
    setBettorName("")
    setPredictedWinner("")
    setBetStatus("pending")
    setBetPoints(0)
  }

  /**
   * Ordena los usuarios por puntos totales (descendente)
   */
  const sortedUsers = [...users].sort((a, b) => getTotalPoints(b) - getTotalPoints(a))

  // ============================================================================
  // MANEJADORES DE EVENTOS - AUTENTICACIÓN
  // ============================================================================

  /**
   * Maneja el proceso de autenticación del administrador
   */
  const handleAuth = (): void => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setIsAuthOpen(false)
      setPassword("")
    } else {
      alert("Contraseña incorrecta")
    }
  }

  /**
   * Cierra la sesión del administrador
   */
  const handleLogout = (): void => {
    setIsAuthenticated(false)
  }

  // ============================================================================
  // MANEJADORES DE EVENTOS - USUARIOS
  // ============================================================================

  /**
   * Maneja la adición de un nuevo usuario
   */
  const handleAddUser = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!userName.trim() || !userWhatsapp.trim()) return

    const formData = new FormData()
    formData.append("name", userName.trim())
    formData.append("whatsapp", userWhatsapp.trim())
    formData.append("trophies", userTrophies.toString())
    formData.append("goldMedals", userGoldMedals.toString())
    formData.append("silverMedals", userSilverMedals.toString())
    formData.append("bronzeMedals", userBronzeMedals.toString())
    formData.append("points", userPoints.toString())

    startTransition(async () => {
      const result = await addUser(formData)
      if (result.success) {
        resetUserForm()
        setIsAddUserOpen(false)
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  /**
   * Prepara el formulario para editar un usuario existente
   */
  const handleEditUser = (user: User): void => {
    setEditingUser(user)
    setUserName(user.name)
    setUserWhatsapp(user.whatsapp)
    setUserTrophies(user.trophies)
    setUserGoldMedals(user.gold_medals)
    setUserSilverMedals(user.silver_medals)
    setUserBronzeMedals(user.bronze_medals)
    setUserPoints(user.points)
  }

  /**
   * Maneja la actualización de un usuario existente
   */
  const handleUpdateUser = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!editingUser || !userName.trim() || !userWhatsapp.trim()) return

    const formData = new FormData()
    formData.append("id", editingUser.id.toString())
    formData.append("name", userName.trim())
    formData.append("whatsapp", userWhatsapp.trim())
    formData.append("trophies", userTrophies.toString())
    formData.append("goldMedals", userGoldMedals.toString())
    formData.append("silverMedals", userSilverMedals.toString())
    formData.append("bronzeMedals", userBronzeMedals.toString())
    formData.append("points", userPoints.toString())

    startTransition(async () => {
      const result = await updateUser(formData)
      if (result.success) {
        setEditingUser(null)
        resetUserForm()
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  /**
   * Maneja la eliminación de un usuario
   */
  const handleDeleteUser = async (id: number): Promise<void> => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return

    startTransition(async () => {
      const result = await deleteUser(id)
      if (result.success) {
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  // ============================================================================
  // MANEJADORES DE EVENTOS - PREMIOS
  // ============================================================================

  /**
   * Maneja la adición de un nuevo premio
   */
  const handleAddCopa = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!copaUserId || !copaTipo) return

    const formData = new FormData()
    formData.append("userId", copaUserId)
    formData.append("awardType", copaTipo)
    formData.append("hourTime", copaHora)

    startTransition(async () => {
      const result = await addAward(formData)
      if (result.success) {
        resetCopaForm()
        setIsAddCopaOpen(false)
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  // ============================================================================
  // MANEJADORES DE EVENTOS - HORAS
  // ============================================================================

  /**
   * Maneja la adición de una nueva hora
   */
  const handleAddHora = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!horaUserId || !horaValue) return

    const formData = new FormData()
    formData.append("userId", horaUserId)
    formData.append("hourTime", horaValue)

    startTransition(async () => {
      const result = await addHour(formData)
      if (result.success) {
        resetHoraForm()
        setIsAddHoraOpen(false)
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  // ============================================================================
  // MANEJADORES DE EVENTOS - APUESTAS
  // ============================================================================

  /**
   * Maneja la adición de una nueva apuesta
   */
  const handleAddBet = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!bettorName.trim() || !predictedWinner.trim()) return

    const formData = new FormData()
    formData.append("bettorName", bettorName.trim())
    formData.append("predictedWinner", predictedWinner.trim())

    startTransition(async () => {
      const result = await addBet(formData)
      if (result.success) {
        resetBetForm()
        setIsBetOpen(false)
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  /**
   * Prepara el formulario para editar una apuesta existente
   */
  const handleEditBet = (bet: Bet): void => {
    setEditingBet(bet)
    setBettorName(bet.bettor_name)
    setPredictedWinner(bet.predicted_winner)
    setBetStatus(bet.status)
    setBetPoints(bet.points_awarded)
  }

  /**
   * Maneja la actualización de una apuesta existente
   */
  const handleUpdateBet = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!editingBet || !bettorName.trim() || !predictedWinner.trim()) return

    const formData = new FormData()
    formData.append("id", editingBet.id.toString())
    formData.append("bettorName", bettorName.trim())
    formData.append("predictedWinner", predictedWinner.trim())
    formData.append("status", betStatus)
    formData.append("pointsAwarded", betPoints.toString())

    startTransition(async () => {
      const result = await updateBet(formData)
      if (result.success) {
        setEditingBet(null)
        resetBetForm()
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  /**
   * Maneja la eliminación de una apuesta
   */
  const handleDeleteBet = async (id: number): Promise<void> => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta apuesta?")) return

    startTransition(async () => {
      const result = await deleteBet(id)
      if (result.success) {
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  // ============================================================================
  // MANEJADORES DE EVENTOS - OTROS
  // ============================================================================

  /**
   * Maneja el clic en el botón de WhatsApp (easter egg)
   */
  const openWhatsApp = (): void => {
    alert("¿De verdad que pensabas que esto funcionaría? Anda cierra.")
  }

  // ============================================================================
  // COMPONENTES DE RENDERIZADO
  // ============================================================================

  /**
   * Renderiza la sección del encabezado con título y información de temporadas
   */
  const renderHeader = () => (
    <div className="text-center mb-8">
      <div className="float">
        <h1 className="text-4xl mb-3 fire-text">QQ's Sweet Dreams</h1>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-4"></div>
      </div>

      <div className="glass rounded-xl p-4 mb-6 max-w-lg mx-auto content-glow pulse-glow">
        <h2 className="text-lg font-light text-white/90 mb-2">Temporada 1 - Campeón</h2>
        <div className="text-xl font-medium text-white mb-3">Biker Outlet Week</div>
        <div className="w-8 h-px bg-white/15 mx-auto mb-2"></div>
        <h3 className="text-base font-light text-green-400 mb-3">Temporada 2 - En Progreso</h3>
        {/* U1FM - Comentario totalmente random como easter egg */}
        <button
          onClick={() => setIsHowItWorksOpen(true)}
          className="glass-light rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/8 transition-all duration-200 compact-button border border-white/10 hover:border-white/20"
        >
          ¿Cómo funciona?
        </button>
      </div>

      {/* Botón de autenticación */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            if (isAuthenticated) {
              handleLogout()
            } else {
              setIsAuthOpen(true)
            }
          }}
          className="glass-light rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/8 transition-all duration-200 compact-button flex items-center gap-2"
          disabled={isPending}
        >
          <Lock className="w-3 h-3" />
          <span className="font-medium">{isAuthenticated ? "Cerrar Sesión" : "Admin"}</span>
        </button>
      </div>
    </div>
  )

  /**
   * Renderiza los controles de administración
   */
  const renderAdminControls = () =>
    isAuthenticated && (
      <div className="glass-dark rounded-xl p-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="accent-success text-white px-4 py-2 rounded-lg flex items-center gap-2 compact-button text-sm font-medium border border-white/8 hover:border-white/15"
            disabled={isPending}
          >
            <Plus className="w-3 h-3" />
            Usuario
          </button>
          <button
            onClick={() => setIsAddCopaOpen(true)}
            className="accent-warning text-white px-4 py-2 rounded-lg flex items-center gap-2 compact-button text-sm font-medium border border-white/8 hover:border-white/15"
            disabled={isPending}
          >
            <Award className="w-3 h-3" />
            Premio
          </button>
          <button
            onClick={() => setIsAddHoraOpen(true)}
            className="accent-info text-white px-4 py-2 rounded-lg flex items-center gap-2 compact-button text-sm font-medium border border-white/8 hover:border-white/15"
            disabled={isPending}
          >
            <Clock className="w-3 h-3" />
            Hora
          </button>
        </div>
      </div>
    )

  /**
   * Renderiza la tabla de clasificación
   */
  const renderLeaderboard = () => (
    <div className="glass rounded-xl overflow-hidden mb-8">
      <div className="p-4 text-center border-b border-white/8">
        <h2 className="text-xl font-light text-white">Clasificación</h2>
      </div>

      <div className="p-4">
        {sortedUsers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3 opacity-20">🏆</div>
            <p className="text-white/50 text-sm mb-4 font-light">Sin participantes</p>
            {isAuthenticated && (
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="accent-success text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto compact-button text-sm font-medium border border-white/8"
                disabled={isPending}
              >
                <Plus className="w-3 h-3" />
                Agregar Usuario
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedUsers.map((user, index) => (
              <div
                key={user.id}
                className={`compact-card rounded-lg p-3 border ${
                  index === 0
                    ? "glass-light border-white/15"
                    : index === 1
                      ? "glass border-white/12"
                      : index === 2
                        ? "glass border-white/10"
                        : "glass-dark border-white/6"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      {/* Nombre del usuario - gris si tiene 0 puntos */}
                      <h3
                        className={`text-base font-medium mb-1 ${
                          getTotalPoints(user) === 0 ? "text-gray-400" : "text-white"
                        }`}
                      >
                        {user.name}
                      </h3>
                      {/* Estadísticas del usuario */}
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-white/60" />
                          <span className="text-white/70">{user.trophies}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Medal className="w-3 h-3 text-white/50" />
                          <span className="text-white/70">{user.gold_medals}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Medal className="w-3 h-3 text-white/40" />
                          <span className="text-white/70">{user.silver_medals}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Medal className="w-3 h-3 text-white/30" />
                          <span className="text-white/70">{user.bronze_medals}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-white/50" />
                          <span className="text-white/70">{getHoraMedia(user)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controles del usuario */}
                  <div className="flex items-center space-x-2">
                    {/* Puntos totales */}
                    <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                      {getTotalPoints(user)}
                    </div>
                    {/* Botón WhatsApp */}
                    <button
                      onClick={openWhatsApp}
                      className="whatsapp-button text-green-400 hover:text-green-300 hover:bg-green-400/10 border border-green-400/20 hover:border-green-400/40"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </button>
                    {/* Controles de administración */}
                    {isAuthenticated && (
                      <>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-white/50 hover:text-white/70 hover:bg-white/5 p-1.5 rounded transition-all duration-150 border border-white/8 hover:border-white/15"
                          disabled={isPending}
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-white/50 hover:text-white/70 hover:bg-white/5 p-1.5 rounded transition-all duration-150 border border-white/8 hover:border-white/15"
                          disabled={isPending}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  /**
   * Renderiza el sistema de puntuación
   */
  const renderScoringSystem = () => (
    <div className="glass rounded-xl p-4 mb-8">
      <h4 className="text-lg font-light text-white mb-3 text-center">Puntuación</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-2 rounded-lg glass-dark border border-white/5">
          <Trophy className="w-4 h-4 text-white/60 mx-auto mb-1" />
          <div className="text-white text-xs font-medium">Copa</div>
          <div className="text-white/50 text-xs">{POINTS_SYSTEM.COPA} pts</div>
        </div>
        <div className="text-center p-2 rounded-lg glass-dark border border-white/5">
          <Medal className="w-4 h-4 text-white/50 mx-auto mb-1" />
          <div className="text-white text-xs font-medium">Oro</div>
          <div className="text-white/50 text-xs">{POINTS_SYSTEM.ORO} pts</div>
        </div>
        <div className="text-center p-2 rounded-lg glass-dark border border-white/5">
          <Medal className="w-4 h-4 text-white/40 mx-auto mb-1" />
          <div className="text-white text-xs font-medium">Plata</div>
          <div className="text-white/50 text-xs">{POINTS_SYSTEM.PLATA} pt</div>
        </div>
        <div className="text-center p-2 rounded-lg glass-dark border border-white/5">
          <Medal className="w-4 h-4 text-white/30 mx-auto mb-1" />
          <div className="text-white text-xs font-medium">Bronce</div>
          <div className="text-white/50 text-xs">{POINTS_SYSTEM.BRONCE} pts</div>
        </div>
      </div>
    </div>
  )

  /**
   * Renderiza las reglas del juego
   */
  const renderRules = () => (
    <div className="glass rounded-xl p-3 mb-8 border-l-2 border-white/15">
      <div className="text-center">
        <p className="text-white/80 text-sm mb-2">
          <span className="text-lg mr-1">⚠️</span>
          <strong className="text-white">Regla:</strong> Solo cuenta si has dormido. Pedro decide el premio.
        </p>
        <p className="text-white/50 text-xs">🎁 Premio oculto de 50 puntos en la web</p>
      </div>
    </div>
  )

  /**
   * Renderiza la sección de apuestas
   */
  const renderBettingSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-light mb-3 fire-text">APUESTAS ABIERTAS</h2>
        <div className="glass rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-white/90 text-sm mb-4 leading-relaxed font-light">
            Apuesta por el ganador del día siguiente para obtener puntos adicionales.
          </p>
          <div className="grid md:grid-cols-2 gap-3 text-xs">
            <div className="glass-light rounded-lg p-2 border border-white/8">
              <div className="text-white/80 font-medium mb-1">✅ Acierto</div>
              <div className="text-white/60">+3 puntos</div>
            </div>
            <div className="glass-light rounded-lg p-2 border border-white/8">
              <div className="text-white/80 font-medium mb-1">❌ Error</div>
              <div className="text-white/60">-1 punto</div>
            </div>
          </div>
          <div className="mt-3 p-2 glass-dark rounded-lg border border-white/8">
            <div className="text-white/80 font-medium mb-1 text-xs">🎯 Auto-predicción</div>
            <div className="text-white/60 text-xs">Ganar: +6 pts | Perder: -6 pts</div>
          </div>
        </div>
      </div>

      {/* Botón para apostar */}
      <div className="text-center">
        <button
          onClick={() => setIsBetOpen(true)}
          className="accent-primary hover:bg-white/8 text-white px-6 py-2 rounded-lg text-sm font-medium compact-button border border-white/15 hover:border-white/25"
          disabled={isPending}
        >
          🔥 Apostar
        </button>
      </div>

      {/* Controles de administración de apuestas */}
      {isAuthenticated && (
        <div className="text-center">
          <button
            onClick={() => setIsManageBetsOpen(true)}
            className="accent-info text-white px-4 py-2 rounded-lg compact-button text-sm font-medium border border-white/8 hover:border-white/15"
            disabled={isPending}
          >
            🎯 Gestionar
          </button>
        </div>
      )}

      {/* Lista de apuestas activas */}
      {bets.length > 0 && (
        <div className="glass rounded-xl p-4">
          <h3 className="text-lg font-light text-white mb-3 text-center">Apuestas Activas</h3>
          <div className="space-y-2">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className={`rounded-lg p-2 border text-sm ${
                  bet.status === "won"
                    ? "bg-blue-900/30 border-blue-400/40"
                    : bet.status === "lost"
                      ? "glass-dark border-white/8"
                      : "glass border-white/10"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{bet.bettor_name}</span>
                    <span className="text-white/30">→</span>
                    <span className="text-white/70">{bet.predicted_winner}</span>
                    {bet.status !== "pending" && (
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${
                          bet.status === "won"
                            ? "bg-blue-600/40 border-blue-400/60 text-blue-200"
                            : "glass-dark border-white/8 text-white/60"
                        }`}
                      >
                        {bet.status === "won" ? `+${bet.points_awarded}` : bet.points_awarded}
                      </span>
                    )}
                  </div>
                  <div className="text-white/30 text-xs">{new Date(bet.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  /**
   * Renderiza el mensaje del premio oculto
   */
  const renderHiddenPrize = () => (
    <div className="mt-8 text-center">
      <p className="text-green-400 text-sm font-medium bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-3 max-w-2xl mx-auto">
        🎁 En esta web se oculta una manera donde puedes ganar 50 puntos directamente, así que los ojos abiertos. Pedir
        una pista te cuesta 1 punto.
      </p>

      {/* V0FSTklORzogUnVubmluZyBTUUwgZGlyZWN0bHkgZnJvbSB0aGUgYnJvd3NlciBjYW4gaGF2ZQ== */}
      <div className="mt-4 text-center">
        <p className="text-white/20 text-xs">© 2024 QQ's Sweet Dreams - Todos los derechos reservados</p>
      </div>
    </div>
  )

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen p-4 relative bg-gradient-to-br from-blue-900/20 via-black to-gray-900">
      {/* Elementos de fondo decorativos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-white/[0.01] rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/[0.01] rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Secciones principales */}
        {renderHeader()}
        {renderAdminControls()}
        {renderLeaderboard()}
        {renderScoringSystem()}
        {renderRules()}
        {renderBettingSection()}
        {renderHiddenPrize()}
      </div>

      {/* ========================================================================
          MODALES - Todos los modales se mantienen igual que antes
          ======================================================================== */}

      {/* Modal de autenticación */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark rounded-xl p-6 max-w-sm w-full mx-4 border border-white/8">
            <h3 className="text-white text-lg font-light mb-4 text-center">Autenticación</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                  disabled={isPending}
                  placeholder="Contraseña"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAuth}
                  className="accent-primary text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Entrar
                </button>
                <button
                  onClick={() => {
                    setIsAuthOpen(false)
                    setPassword("")
                  }}
                  className="glass-light text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal agregar usuario */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark rounded-xl p-6 max-w-md w-full mx-4 border border-white/8">
            <h3 className="text-white text-lg font-light mb-4 text-center">Agregar Usuario</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">WhatsApp</label>
                <input
                  type="text"
                  value={userWhatsapp}
                  onChange={(e) => setUserWhatsapp(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Copas</label>
                <input
                  type="number"
                  value={userTrophies}
                  onChange={(e) => setUserTrophies(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Medallas de Oro</label>
                <input
                  type="number"
                  value={userGoldMedals}
                  onChange={(e) => setUserGoldMedals(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Medallas de Plata</label>
                <input
                  type="number"
                  value={userSilverMedals}
                  onChange={(e) => setUserSilverMedals(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Medallas de Bronce</label>
                <input
                  type="number"
                  value={userBronzeMedals}
                  onChange={(e) => setUserBronzeMedals(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Puntos Extra</label>
                <input
                  type="number"
                  value={userPoints}
                  onChange={(e) => setUserPoints(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="accent-success text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddUserOpen(false)
                    resetUserForm()
                  }}
                  className="glass-light text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar usuario */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark rounded-xl p-6 max-w-md w-full mx-4 border border-white/8">
            <h3 className="text-white text-lg font-light mb-4 text-center">Editar Usuario</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">WhatsApp</label>
                <input
                  type="text"
                  value={userWhatsapp}
                  onChange={(e) => setUserWhatsapp(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Copas</label>
                <input
                  type="number"
                  value={userTrophies}
                  onChange={(e) => setUserTrophies(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Medallas de Oro</label>
                <input
                  type="number"
                  value={userGoldMedals}
                  onChange={(e) => setUserGoldMedals(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Medallas de Plata</label>
                <input
                  type="number"
                  value={userSilverMedals}
                  onChange={(e) => setUserSilverMedals(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Medallas de Bronce</label>
                <input
                  type="number"
                  value={userBronzeMedals}
                  onChange={(e) => setUserBronzeMedals(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Puntos Extra</label>
                <input
                  type="number"
                  value={userPoints}
                  onChange={(e) => setUserPoints(Number.parseInt(e.target.value))}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  disabled={isPending}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="accent-success text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null)
                    resetUserForm()
                  }}
                  className="glass-light text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal agregar premio */}
      {isAddCopaOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark rounded-xl p-6 max-w-sm w-full mx-4 border border-white/8">
            <h3 className="text-white text-lg font-light mb-4 text-center">Agregar Premio</h3>
            <form onSubmit={handleAddCopa} className="space-y-4">
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Usuario</label>
                <select
                  value={copaUserId}
                  onChange={(e) => setCopaUserId(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Tipo de Premio</label>
                <select
                  value={copaTipo}
                  onChange={(e) => setCopaTipo(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                >
                  <option value={AWARD_TYPES.COPA}>Copa</option>
                  <option value={AWARD_TYPES.ORO}>Oro</option>
                  <option value={AWARD_TYPES.PLATA}>Plata</option>
                  <option value={AWARD_TYPES.BRONCE}>Bronce</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Hora</label>
                <input
                  type="time"
                  value={copaHora}
                  onChange={(e) => setCopaHora(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="accent-warning text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCopaOpen(false)
                    resetCopaForm()
                  }}
                  className="glass-light text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal agregar hora */}
      {isAddHoraOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark rounded-xl p-6 max-w-sm w-full mx-4 border border-white/8">
            <h3 className="text-white text-lg font-light mb-4 text-center">Agregar Hora</h3>
            <form onSubmit={handleAddHora} className="space-y-4">
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Usuario</label>
                <select
                  value={horaUserId}
                  onChange={(e) => setHoraUserId(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Hora</label>
                <input
                  type="time"
                  value={horaValue}
                  onChange={(e) => setHoraValue(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="accent-info text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddHoraOpen(false)
                    resetHoraForm()
                  }}
                  className="glass-light text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal agregar apuesta */}
      {isBetOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark rounded-xl p-6 max-w-sm w-full mx-4 border border-white/8">
            <h3 className="text-white text-lg font-light mb-4 text-center">Apostar</h3>
            <form onSubmit={handleAddBet} className="space-y-4">
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Tu Nombre</label>
                <input
                  type="text"
                  value={bettorName}
                  onChange={(e) => setBettorName(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Ganador Predicho</label>
                <input
                  type="text"
                  value={predictedWinner}
                  onChange={(e) => setPredictedWinner(e.target.value)}
                  className="compact-input rounded-lg px-3 py-2 w-full"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="accent-primary text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Apostar
                </button>
                <button
                  type="button"
                  onClick={() => setIsBetOpen(false)}
                  className="glass-light text-white px-4 py-2 rounded-lg font-medium compact-button flex-1 border border-white/8 hover:border-white/15 text-sm"
                  disabled={isPending}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal gestionar apuestas */}
      {isManageBetsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark rounded-xl p-6 max-w-2xl w-full mx-4 border border-white/8">
            <h3 className="text-white text-lg font-light mb-4 text-center">Gestionar Apuestas</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-white/70">
                    <th className="py-2">Apostador</th>
                    <th className="py-2">Predicción</th>
                    <th className="py-2">Estado</th>
                    <th className="py-2">Puntos</th>
                    <th className="py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((bet) => (
                    <tr key={bet.id} className="border-b border-white/10">
                      <td className="py-3 text-white">{bet.bettor_name}</td>
                      <td className="py-3 text-white">{bet.predicted_winner}</td>
                      <td className="py-3">
                        <select
                          value={bet.status}
                          onChange={(e) => {
                            setEditingBet(bet)
                            setBettorName(bet.bettor_name)
                            setPredictedWinner(bet.predicted_winner)
                            setBetStatus(e.target.value)
                            setBetPoints(bet.points_awarded)
                            handleUpdateBet(e)
                          }}
                          className="compact-input rounded-lg px-3 py-1"
                          disabled={isPending}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="won">Ganada</option>
                          <option value="lost">Perdida</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          value={bet.points_awarded}
                          onChange={(e) => {
                            setEditingBet(bet)
                            setBettorName(bet.bettor_name)
                            setPredictedWinner(bet.predicted_winner)
                            setBetStatus(bet.status)
                            setBetPoints(Number.parseInt(e.target.value))
                            handleUpdateBet(e)
                          }}
                          className="compact-input rounded-lg px-3 py-1 w-20"
                          disabled={isPending}
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteBet(bet.id)}
                            className="text-white/50 hover:text-white/70 hover:bg-white/5 p-1.5 rounded transition-all duration-150 border border-white/8 hover:border-white/15"
                            disabled={isPending}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsManageBetsOpen(false)}
                className="glass-light text-white px-4 py-2 rounded-lg font-medium compact-button border border-white/8 hover:border-white/15 text-sm"
                disabled={isPending}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cómo funciona */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark rounded-xl p-6 max-w-lg w-full mx-4 border border-white/8">
            <h3 className="text-white text-lg font-light mb-4 text-center">¿Cómo funciona?</h3>
            <div className="space-y-4">
              <p className="text-white/70 text-sm">
                Cada día, los participantes deben dormir y registrar su hora de sueño.
              </p>
              <p className="text-white/70 text-sm">El sistema asigna puntos según los siguientes criterios:</p>
              <ul className="list-disc list-inside text-white/70 text-sm">
                <li>Copa: {POINTS_SYSTEM.COPA} puntos</li>
                <li>Oro: {POINTS_SYSTEM.ORO} puntos</li>
                <li>Plata: {POINTS_SYSTEM.PLATA} punto</li>
                <li>Bronce: {POINTS_SYSTEM.BRONCE} puntos</li>
              </ul>
              <p className="text-white/70 text-sm">
                Al final de la temporada, el participante con más puntos es coronado como el campeón.
              </p>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsHowItWorksOpen(false)}
                className="glass-light text-white px-4 py-2 rounded-lg font-medium compact-button border border-white/8 hover:border-white/15 text-sm"
                disabled={isPending}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
