"use client"

import type React from "react"
import { useState, useTransition, useEffect } from "react"
import { Plus, Edit, Trash2, Award, MessageCircle, Lock, Clock, Trophy, Medal, Menu, X } from "lucide-react"
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
const ADMIN_PASSWORD = "!m2YieLN#HLJrbk^qz8n$yiJZjt40@QnmAR$aWjXUj&8#F9c*L"
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
  const [isMobile, setIsMobile] = useState(false)

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
  const [isRulesOpen, setIsRulesOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // ----------------------------------------------------------------------------
  // ESTADO DE APUESTAS
  // ----------------------------------------------------------------------------
  const [isBetOpen, setIsBetOpen] = useState(false)
  const [isManageBetsOpen, setIsManageBetsOpen] = useState(false)
  const [editingBet, setEditingBet] = useState<Bet | null>(null)

  // ----------------------------------------------------------------------------
  // ESTADO DE RIVALS
  // ----------------------------------------------------------------------------
  const [isRivalsOpen, setIsRivalsOpen] = useState(false)
  const [isRivalsHowItWorksOpen, setIsRivalsHowItWorksOpen] = useState(false)
  const [isManageRivalsOpen, setIsManageRivalsOpen] = useState(false)
  const [rivalsBettorName, setRivalsBettorName] = useState("")
  const [rivalsTarget, setRivalsTarget] = useState("")

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

  /**
   * Calcula el total de puntos de un usuario basado en sus premios
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
   * Resetea todos los campos del formulario de RIVALS
   */
  const resetRivalsForm = (): void => {
    setRivalsBettorName("")
    setRivalsTarget("")
  }

  /**
   * Ordena los usuarios por puntos totales (descendente)
   */
  const sortedUsers = [...users]
    .filter((user) => getTotalPoints(user) > 0)
    .sort((a, b) => getTotalPoints(b) - getTotalPoints(a))

  // ============================================================================
  // MANEJADORES DE EVENTOS - AUTENTICACIÓN
  // ============================================================================

  const handleAuth = (): void => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setIsAuthOpen(false)
      setPassword("")
    } else {
      alert("Contraseña incorrecta")
    }
  }

  const handleLogout = (): void => {
    setIsAuthenticated(false)
  }

  // ============================================================================
  // MANEJADORES DE EVENTOS - USUARIOS
  // ============================================================================

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

  const handleEditBet = (bet: Bet): void => {
    setEditingBet(bet)
    setBettorName(bet.bettor_name)
    setPredictedWinner(bet.predicted_winner)
    setBetStatus(bet.status)
    setBetPoints(bet.points_awarded)
  }

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
  // MANEJADORES DE EVENTOS - RIVALS
  // ============================================================================

  const handleAddRivals = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!rivalsBettorName.trim() || !rivalsTarget.trim()) return

    const targetUser = users.find((user) => user.name.toLowerCase().includes(rivalsTarget.toLowerCase()))
    if (!targetUser || getTotalPoints(targetUser) === 0) {
      alert("Solo puedes apostar contra usuarios que ya tengan puntos en su cuenta")
      return
    }

    const formData = new FormData()
    formData.append("bettorName", rivalsBettorName.trim())
    formData.append("predictedWinner", `RIVALS: ${rivalsTarget.trim()}`)
    formData.append("rivalsBet", "true")

    startTransition(async () => {
      const result = await addBet(formData)
      if (result.success) {
        resetRivalsForm()
        setIsRivalsOpen(false)
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  // ============================================================================
  // MANEJADORES DE EVENTOS - OTROS
  // ============================================================================

  const openWhatsApp = (): void => {
    alert("¿De verdad que pensabas que esto funcionaría? Anda cierra.")
  }

  // ============================================================================
  // COMPONENTES DE RENDERIZADO
  // ============================================================================

  const renderMobileHeader = () => (
    <header className="ios-nav safe-top">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="touch-button p-2 rounded-lg glass-light"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        <h1 className="text-lg font-bold fire-text">QQ's Sweet Dreams</h1>

        <button
          onClick={() => {
            if (isAuthenticated) {
              handleLogout()
            } else {
              setIsAuthOpen(true)
            }
          }}
          className="touch-button p-2 rounded-lg glass-light"
          disabled={isPending}
          aria-label={isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
        >
          <Lock className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  )

  const renderDesktopHeader = () => (
    <div className="text-center mb-8">
      <div className="float">
        <h1 className="text-4xl mb-3 fire-text">QQ's Sweet Dreams</h1>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-4"></div>
      </div>

      <div className="glass rounded-xl p-4 mb-6 max-w-lg mx-auto">
        <h2 className="text-lg font-light text-white/90 mb-2">Temporada 1 - Campeón</h2>
        <div className="text-xl font-medium text-white mb-3">Biker Outlet Week</div>
        <div className="w-8 h-px bg-white/15 mx-auto mb-2"></div>
        <h3 className="text-base font-light text-green-400 mb-3">Temporada 2 - En Progreso</h3>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="glass-light rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/8 transition-all duration-200 touch-button border border-white/10 hover:border-white/20"
          >
            ¿Cómo funciona?
          </button>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="glass-light rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/8 transition-all duration-200 touch-button border border-white/10 hover:border-white/20"
          >
            Normas
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            if (isAuthenticated) {
              handleLogout()
            } else {
              setIsAuthOpen(true)
            }
          }}
          className="glass-light rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/8 transition-all duration-200 touch-button flex items-center gap-2"
          disabled={isPending}
        >
          <Lock className="w-3 h-3" />
          <span className="font-medium">{isAuthenticated ? "Cerrar Sesión" : "Admin"}</span>
        </button>
      </div>
    </div>
  )

  const renderMobileMenu = () => (
    <div className={`fixed inset-0 z-50 ${isMenuOpen ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
      <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] glass-dark safe-left safe-top safe-bottom">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Menú</h2>
            <button onClick={() => setIsMenuOpen(false)} className="touch-button p-2 rounded-lg glass-light">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setIsHowItWorksOpen(true)
                setIsMenuOpen(false)
              }}
              className="w-full text-left p-3 rounded-lg glass-light text-white hover:bg-white/10 transition-colors"
            >
              ¿Cómo funciona?
            </button>
            <button
              onClick={() => {
                setIsRulesOpen(true)
                setIsMenuOpen(false)
              }}
              className="w-full text-left p-3 rounded-lg glass-light text-white hover:bg-white/10 transition-colors"
            >
              Normas
            </button>
            <button
              onClick={() => {
                setIsBetOpen(true)
                setIsMenuOpen(false)
              }}
              className="w-full text-left p-3 rounded-lg accent-primary text-white transition-colors"
            >
              🔥 Apostar
            </button>
            <button
              onClick={() => {
                setIsRivalsOpen(true)
                setIsMenuOpen(false)
              }}
              className="w-full text-left p-3 rounded-lg accent-danger text-white transition-colors"
            >
              🔥 RIVALS
            </button>

            {isAuthenticated && (
              <>
                <div className="border-t border-white/10 my-4"></div>
                <h3 className="text-sm font-medium text-white/70 mb-2">Administración</h3>
                <button
                  onClick={() => {
                    setIsAddUserOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left p-3 rounded-lg glass-light text-white hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Agregar Usuario
                </button>
                <button
                  onClick={() => {
                    setIsAddCopaOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left p-3 rounded-lg glass-light text-white hover:bg-white/10 transition-colors"
                >
                  <Award className="w-4 h-4 inline mr-2" />
                  Agregar Premio
                </button>
                <button
                  onClick={() => {
                    setIsAddHoraOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left p-3 rounded-lg glass-light text-white hover:bg-white/10 transition-colors"
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Agregar Hora
                </button>
                <button
                  onClick={() => {
                    setIsManageBetsOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left p-3 rounded-lg glass-light text-white hover:bg-white/10 transition-colors"
                >
                  Gestionar Apuestas
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  )

  const renderAdminControls = () =>
    !isMobile &&
    isAuthenticated && (
      <div className="glass-dark rounded-xl p-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="accent-success text-white px-4 py-2 rounded-lg flex items-center gap-2 touch-button text-sm font-medium border border-white/8 hover:border-white/15"
            disabled={isPending}
          >
            <Plus className="w-3 h-3" />
            Usuario
          </button>
          <button
            onClick={() => setIsAddCopaOpen(true)}
            className="accent-warning text-white px-4 py-2 rounded-lg flex items-center gap-2 touch-button text-sm font-medium border border-white/8 hover:border-white/15"
            disabled={isPending}
          >
            <Award className="w-3 h-3" />
            Premio
          </button>
          <button
            onClick={() => setIsAddHoraOpen(true)}
            className="accent-info text-white px-4 py-2 rounded-lg flex items-center gap-2 touch-button text-sm font-medium border border-white/8 hover:border-white/15"
            disabled={isPending}
          >
            <Clock className="w-3 h-3" />
            Hora
          </button>
        </div>
      </div>
    )

  const renderLeaderboard = () => {
    /**
     * Calcula el estilo basado en los puntos del usuario
     */
    const getPointsStyle = (points: number) => {
      if (points > 50) {
        // Fondo dorado para más de 50 puntos
        return {
          background: "bg-gradient-to-br from-yellow-500/20 via-amber-500/15 to-yellow-600/20 border-yellow-400/40",
          position: "bg-gradient-to-br from-yellow-500 to-amber-600 text-black border-2 border-yellow-300",
          name: "text-yellow-100",
          pointsBadge: "bg-gradient-to-br from-yellow-600 to-amber-700 text-yellow-100 border-yellow-400/80",
        }
      } else if (points === 3) {
        // Azul intenso para 3 puntos
        return {
          background: "bg-blue-600/15 border-blue-400/40",
          position: "bg-blue-600 text-white border-2 border-blue-400",
          name: "text-blue-200",
          pointsBadge: "bg-blue-700 text-blue-100 border-blue-500/80",
        }
      } else if (points === 2) {
        // Azul medio para 2 puntos
        return {
          background: "bg-blue-500/12 border-blue-400/30",
          position: "bg-blue-500 text-white border-2 border-blue-300",
          name: "text-blue-300",
          pointsBadge: "bg-blue-600 text-blue-100 border-blue-400/70",
        }
      } else if (points === 1) {
        // Azul suave para 1 punto
        return {
          background: "bg-blue-400/8 border-blue-400/20",
          position: "bg-blue-400 text-white border-2 border-blue-200",
          name: "text-blue-400",
          pointsBadge: "bg-blue-500 text-blue-200 border-blue-300/60",
        }
      } else {
        // Sin estilo especial para otros valores
        return null
      }
    }

    return (
      <div className="glass rounded-xl overflow-hidden mb-6">
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
                  className="accent-success text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto touch-button text-sm font-medium border border-white/8"
                  disabled={isPending}
                >
                  <Plus className="w-3 h-3" />
                  Agregar Usuario
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedUsers.map((user, index) => {
                // Calcular si hay empate en puntos
                const currentPoints = getTotalPoints(user)
                const previousPoints = index > 0 ? getTotalPoints(sortedUsers[index - 1]) : null
                const nextPoints = index < sortedUsers.length - 1 ? getTotalPoints(sortedUsers[index + 1]) : null
                const hasTie = previousPoints === currentPoints || nextPoints === currentPoints

                // Obtener el estilo basado en los puntos
                const pointsStyle = getPointsStyle(currentPoints)

                return (
                  <div
                    key={user.id}
                    className={`mobile-card rounded-xl p-4 border ${
                      pointsStyle
                        ? pointsStyle.background
                        : index === 0 && !hasTie
                          ? "glass-light border-white/15"
                          : index === 1 && !hasTie
                            ? "glass border-white/12"
                            : index === 2 && !hasTie
                              ? "glass border-white/10"
                              : "glass-dark border-white/6"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              pointsStyle
                                ? pointsStyle.position
                                : index === 0 && !hasTie
                                  ? "bg-yellow-500 text-black"
                                  : index === 1 && !hasTie
                                    ? "bg-gray-400 text-black"
                                    : index === 2 && !hasTie
                                      ? "bg-amber-600 text-black"
                                      : "bg-gray-600 text-white"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <h3
                            className={`text-base font-medium truncate ${
                              getTotalPoints(user) === 0
                                ? "text-gray-400"
                                : pointsStyle
                                  ? pointsStyle.name
                                  : "text-white"
                            }`}
                          >
                            {user.name}
                          </h3>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium border ml-auto ${
                              pointsStyle ? pointsStyle.pointsBadge : "bg-blue-600 text-white border-blue-500/20"
                            }`}
                          >
                            {getTotalPoints(user)}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-yellow-500" />
                            <span className="text-white/70">{user.trophies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Medal className="w-3 h-3 text-yellow-400" />
                            <span className="text-white/70">{user.gold_medals}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Medal className="w-3 h-3 text-gray-400" />
                            <span className="text-white/70">{user.silver_medals}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Medal className="w-3 h-3 text-amber-600" />
                            <span className="text-white/70">{user.bronze_medals}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-400" />
                            <span className="text-white/70">{getHoraMedia(user)}</span>
                          </div>
                        </div>

                        {user.name.toLowerCase().includes("dídac") && (
                          <div className="mt-2 p-2 bg-green-500/20 border border-green-400/40 rounded-lg">
                            <p className="text-green-300 text-xs font-medium">
                              🚨 Dídac ha recibido un premio de 50 puntos por haber vulnerado la seguridad de la web
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-3">
                        <button
                          onClick={openWhatsApp}
                          className="whatsapp-button text-green-400 hover:text-green-300 hover:bg-green-400/10 border border-green-400/20 hover:border-green-400/40"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        {isAuthenticated && (
                          <>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="touch-button text-white/50 hover:text-white/70 hover:bg-white/5 p-2 rounded transition-all duration-150 border border-white/8 hover:border-white/15"
                              disabled={isPending}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="touch-button text-white/50 hover:text-white/70 hover:bg-white/5 p-2 rounded transition-all duration-150 border border-white/8 hover:border-white/15"
                              disabled={isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderScoringSystem = () => (
    <div className="glass rounded-xl p-4 mb-6">
      <h4 className="text-lg font-light text-white mb-3 text-center">Sistema de Puntuación</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-3 rounded-lg glass-dark border border-white/5">
          <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
          <div className="text-white text-sm font-medium">Copa</div>
          <div className="text-white/50 text-xs">{POINTS_SYSTEM.COPA} pts</div>
        </div>
        <div className="text-center p-3 rounded-lg glass-dark border border-white/5">
          <Medal className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <div className="text-white text-sm font-medium">Oro</div>
          <div className="text-white/50 text-xs">{POINTS_SYSTEM.ORO} pts</div>
        </div>
        <div className="text-center p-3 rounded-lg glass-dark border border-white/5">
          <Medal className="w-5 h-5 text-gray-400 mx-auto mb-2" />
          <div className="text-white text-sm font-medium">Plata</div>
          <div className="text-white/50 text-xs">{POINTS_SYSTEM.PLATA} pt</div>
        </div>
        <div className="text-center p-3 rounded-lg glass-dark border border-white/5">
          <Medal className="w-5 h-5 text-amber-600 mx-auto mb-2" />
          <div className="text-white text-sm font-medium">Bronce</div>
          <div className="text-white/50 text-xs">{POINTS_SYSTEM.BRONCE} pts</div>
        </div>
      </div>
    </div>
  )

  const renderRules = () => (
    <div className="glass rounded-xl p-4 mb-6 border-l-4 border-yellow-500">
      <div className="text-center">
        <p className="text-white/80 text-sm mb-2">
          <span className="text-lg mr-1">⚠️</span>
          <strong className="text-white">Regla:</strong> Solo cuenta si has dormido. Pedro decide el premio.
        </p>
        <p className="text-green-400 text-xs">🎁 Premio oculto de 50 puntos en la web</p>
      </div>
    </div>
  )

  const renderBettingSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-light mb-3 fire-text">APUESTAS ABIERTAS</h2>
        <div className="glass rounded-xl p-4">
          <p className="text-white/90 text-sm mb-4 leading-relaxed font-light">
            Apuesta por el ganador del día siguiente para obtener puntos adicionales.
          </p>
          <div className="grid md:grid-cols-2 gap-3 text-xs mb-4">
            <div className="glass-light rounded-lg p-3 border border-white/8">
              <div className="text-white/80 font-medium mb-1">✅ Acierto</div>
              <div className="text-white/60">+3 puntos</div>
            </div>
            <div className="glass-light rounded-lg p-3 border border-white/8">
              <div className="text-white/80 font-medium mb-1">❌ Error</div>
              <div className="text-white/60">-1 punto</div>
            </div>
          </div>
          <div className="p-3 glass-dark rounded-lg border border-white/8">
            <div className="text-white/80 font-medium mb-1 text-xs">🎯 Auto-predicción</div>
            <div className="text-white/60 text-xs">Ganar: +6 pts | Perder: -6 pts</div>
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className="text-center">
          <button
            onClick={() => setIsBetOpen(true)}
            className="accent-primary hover:bg-white/8 text-white px-6 py-3 rounded-lg text-sm font-medium touch-button border border-white/15 hover:border-white/25"
            disabled={isPending}
          >
            🔥 Apostar
          </button>
        </div>
      )}

      {isAuthenticated && !isMobile && (
        <div className="text-center">
          <button
            onClick={() => setIsManageBetsOpen(true)}
            className="accent-info text-white px-4 py-2 rounded-lg touch-button text-sm font-medium border border-white/8 hover:border-white/15"
            disabled={isPending}
          >
            🎯 Gestionar
          </button>
        </div>
      )}

      {bets.length > 0 && (
        <div className="glass rounded-xl p-4">
          <h3 className="text-lg font-light text-white mb-3 text-center">Apuestas Activas</h3>
          <div className="space-y-2">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className={`rounded-lg p-3 border text-sm mobile-card ${
                  bet.status === "won"
                    ? "bg-blue-900/30 border-blue-400/40"
                    : bet.status === "lost"
                      ? "glass-dark border-white/8"
                      : "glass border-white/10"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-white font-medium truncate">{bet.bettor_name}</span>
                    <span className="text-white/30">→</span>
                    <span className="text-white/70 truncate">{bet.predicted_winner}</span>
                    {bet.status !== "pending" && (
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ml-auto ${
                          bet.status === "won"
                            ? "bg-blue-600/40 border-blue-400/60 text-blue-200"
                            : "glass-dark border-white/8 text-white/60"
                        }`}
                      >
                        {bet.status === "won" ? `+${bet.points_awarded}` : bet.points_awarded}
                      </span>
                    )}
                  </div>
                  <div className="text-white/30 text-xs ml-2">
                    {new Date(bet.created_at).toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderRivalsSection = () => (
    <div className="mt-12 space-y-6">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent mb-8"></div>
      <div className="text-center">
        <h2 className="text-2xl font-light mb-3 fire-text">NUEVA SECCIÓN RIVALS QQ</h2>
        <div className="glass rounded-xl p-4">
          <p className="text-white/90 text-sm mb-4 leading-relaxed font-light">
            Apuesta contra quien crees que NO ganará la copa o medalla de oro.
          </p>
          <div className="grid md:grid-cols-2 gap-3 text-xs mb-4">
            <div className="glass-light rounded-lg p-3 border border-green-400/20 bg-green-500/10">
              <div className="text-green-300 font-medium mb-1">✅ Acierto</div>
              <div className="text-green-200">+10 puntos</div>
            </div>
            <div className="glass-light rounded-lg p-3 border border-red-400/20 bg-red-500/10">
              <div className="text-red-300 font-medium mb-1">❌ Error</div>
              <div className="text-red-200">-3 puntos o vuelves a 0</div>
            </div>
          </div>
          <div className="p-3 glass-dark rounded-lg border border-yellow-400/20 bg-yellow-500/10">
            <div className="text-yellow-300 font-medium mb-1 text-xs">⚠️ Restricción</div>
            <div className="text-yellow-200 text-xs">Solo contra usuarios con puntos activos</div>
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setIsRivalsHowItWorksOpen(true)}
            className="glass-light rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/8 transition-all duration-200 touch-button border border-white/10 hover:border-white/20"
          >
            ¿Cómo funciona?
          </button>
          <button
            onClick={() => setIsRivalsOpen(true)}
            className="accent-danger hover:bg-red-500/20 text-white px-6 py-3 rounded-lg text-sm font-medium touch-button border border-red-400/30 hover:border-red-400/50"
            disabled={isPending}
          >
            🔥 RIVALS
          </button>
        </div>
      )}

      {isAuthenticated && !isMobile && (
        <div className="text-center">
          <button
            onClick={() => setIsManageRivalsOpen(true)}
            className="accent-danger text-white px-4 py-2 rounded-lg touch-button text-sm font-medium border border-red-400/20 hover:border-red-400/40"
            disabled={isPending}
          >
            🎯 Gestionar RIVALS
          </button>
        </div>
      )}

      {bets.filter((bet) => bet.predicted_winner.startsWith("RIVALS:")).length > 0 && (
        <div className="glass rounded-xl p-4 border border-red-400/20">
          <h3 className="text-lg font-light text-white mb-3 text-center">RIVALS Activos</h3>
          <div className="space-y-2">
            {bets
              .filter((bet) => bet.predicted_winner.startsWith("RIVALS:"))
              .map((bet) => (
                <div
                  key={bet.id}
                  className={`rounded-lg p-3 border text-sm mobile-card ${
                    bet.status === "won"
                      ? "bg-green-900/30 border-green-400/40"
                      : bet.status === "lost"
                        ? "bg-red-900/30 border-red-400/40"
                        : "glass border-red-400/20"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-white font-medium truncate">{bet.bettor_name}</span>
                      <span className="text-red-400 font-bold">VS</span>
                      <span className="text-white/70 truncate">{bet.predicted_winner.replace("RIVALS: ", "")}</span>
                      {bet.status !== "pending" && (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ml-auto ${
                            bet.status === "won"
                              ? "bg-green-600/40 border-green-400/60 text-green-200"
                              : "bg-red-600/40 border-red-400/60 text-red-200"
                          }`}
                        >
                          {bet.status === "won" ? `+${bet.points_awarded}` : bet.points_awarded}
                        </span>
                      )}
                    </div>
                    <div className="text-white/30 text-xs ml-2">
                      {new Date(bet.created_at).toLocaleDateString("es-ES")}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderHiddenPrize = () => (
    <div className="mt-8 text-center">
      <p className="text-green-400 text-sm font-medium bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-3">
        🎁 En esta web se oculta una manera donde puedes ganar 50 puntos directamente, así que los ojos abiertos. Pedir
        una pista te cuesta 1 punto.
      </p>
    </div>
  )

  const renderTransparencyNotice = () => (
    <div className="mt-8 glass rounded-xl p-4 border border-green-400/30 bg-green-500/10">
      <div className="text-center">
        <h4 className="text-green-300 font-medium mb-3 flex items-center justify-center gap-2">
          <span className="text-lg">🔍</span>
          TRANSPARENCIA
        </h4>
        <p className="text-green-200 text-sm leading-relaxed mb-4">
          Esta página no guarda ningún tipo de registro, puedes usar tus extensiones para rastrear, NO guarda IPS, no
          guarda absolutamente nada que no esté puesto por el juego. Para poder ver el código y hacer vuestras propias
          comprobaciones (psst... o usarlo para encontrar los premios 50p) Todo está en{" "}
          <a
            href="https://github.com/MikeBlacKdevel/QQSweetDreams"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-300 hover:text-green-100 underline font-medium"
          >
            https://github.com/MikeBlacKdevel/QQSweetDreams
          </a>
        </p>
        <div className="w-8 h-px bg-green-400/30 mx-auto mb-3"></div>
        <p className="text-green-300 text-sm font-medium">
          El premio a final de temporada va a ser otorgado por Pedro Llanes o colaboradores, pero será interesante.
        </p>
      </div>
    </div>
  )

  const renderMobileModal = (isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode) => (
    <div className={`bottom-sheet ${isOpen ? "open" : ""}`}>
      <div className="bottom-sheet-handle"></div>
      <div className="px-4 pb-4 safe-bottom">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <button onClick={onClose} className="touch-button p-2 rounded-lg glass-light">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="custom-scroll">{children}</div>
      </div>
    </div>
  )

  const renderDesktopModal = (
    isOpen: boolean,
    onClose: () => void,
    title: string,
    children: React.ReactNode,
    maxWidth = "max-w-md",
  ) =>
    isOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className={`glass-dark rounded-xl p-6 ${maxWidth} w-full border border-white/8 mobile-modal custom-scroll`}
        >
          <h3 className="text-white text-lg font-light mb-4 text-center">{title}</h3>
          {children}
        </div>
      </div>
    )

  const renderModal = (
    isOpen: boolean,
    onClose: () => void,
    title: string,
    children: React.ReactNode,
    maxWidth = "max-w-md",
  ) => {
    if (isMobile) {
      return renderMobileModal(isOpen, onClose, title, children)
    }
    return renderDesktopModal(isOpen, onClose, title, children, maxWidth)
  }

  const renderFloatingActionButtons = () =>
    isMobile && (
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-40">
        <button
          onClick={() => setIsBetOpen(true)}
          className="fab accent-primary"
          disabled={isPending}
          aria-label="Apostar"
        >
          <span className="text-lg">🔥</span>
        </button>
        <button
          onClick={() => setIsRivalsOpen(true)}
          className="fab accent-danger"
          disabled={isPending}
          aria-label="RIVALS"
        >
          <span className="text-lg">⚔️</span>
        </button>
      </div>
    )

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-blue-900/20 via-black to-gray-900 relative">
      {/* Elementos de fondo decorativos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-white/[0.01] rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/[0.01] rounded-full blur-2xl"></div>
      </div>

      {/* Header móvil o desktop */}
      {isMobile ? renderMobileHeader() : null}

      {/* Menú móvil */}
      {renderMobileMenu()}

      <main className={`relative z-10 ${isMobile ? "safe-left safe-right safe-bottom" : "max-w-5xl mx-auto"} p-4`}>
        {/* Header desktop */}
        {!isMobile && renderDesktopHeader()}

        {/* Controles de administración desktop */}
        {renderAdminControls()}

        {/* Secciones principales */}
        {renderLeaderboard()}
        {renderScoringSystem()}
        {renderRules()}
        {renderBettingSection()}
        {renderRivalsSection()}
        {renderHiddenPrize()}
        {renderTransparencyNotice()}
      </main>

      {/* Botones flotantes móviles */}
      {renderFloatingActionButtons()}

      {/* ========================================================================
          MODALES
          ======================================================================== */}

      {/* Modal de autenticación */}
      {renderModal(
        isAuthOpen,
        () => setIsAuthOpen(false),
        "Autenticación",
        <div className="space-y-4">
          <div>
            <label className="text-white/70 block mb-2 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mobile-input px-3 py-3 w-full"
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              disabled={isPending}
              placeholder="Contraseña"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAuth}
              className="accent-primary text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
              disabled={isPending}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setIsAuthOpen(false)
                setPassword("")
              }}
              className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </div>,
      )}

      {/* Modal agregar usuario */}
      {renderModal(
        isAddUserOpen,
        () => setIsAddUserOpen(false),
        "Agregar Usuario",
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="text-white/70 block mb-2 text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mobile-input px-3 py-3 w-full"
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
              className="mobile-input px-3 py-3 w-full"
              required
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 block mb-2 text-sm font-medium">Copas</label>
              <input
                type="number"
                value={userTrophies}
                onChange={(e) => setUserTrophies(Number.parseInt(e.target.value) || 0)}
                className="mobile-input px-3 py-3 w-full"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="text-white/70 block mb-2 text-sm font-medium">Oro</label>
              <input
                type="number"
                value={userGoldMedals}
                onChange={(e) => setUserGoldMedals(Number.parseInt(e.target.value) || 0)}
                className="mobile-input px-3 py-3 w-full"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="text-white/70 block mb-2 text-sm font-medium">Plata</label>
              <input
                type="number"
                value={userSilverMedals}
                onChange={(e) => setUserSilverMedals(Number.parseInt(e.target.value) || 0)}
                className="mobile-input px-3 py-3 w-full"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="text-white/70 block mb-2 text-sm font-medium">Bronce</label>
              <input
                type="number"
                value={userBronzeMedals}
                onChange={(e) => setUserBronzeMedals(Number.parseInt(e.target.value) || 0)}
                className="mobile-input px-3 py-3 w-full"
                disabled={isPending}
              />
            </div>
          </div>
          <div>
            <label className="text-white/70 block mb-2 text-sm font-medium">Puntos Extra</label>
            <input
              type="number"
              value={userPoints}
              onChange={(e) => setUserPoints(Number.parseInt(e.target.value) || 0)}
              className="mobile-input px-3 py-3 w-full"
              disabled={isPending}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="accent-success text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
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
              className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </form>,
        "max-w-lg",
      )}

      {/* Modal editar usuario */}
      {editingUser &&
        renderModal(
          !!editingUser,
          () => setEditingUser(null),
          "Editar Usuario",
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="text-white/70 block mb-2 text-sm font-medium">Nombre</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mobile-input px-3 py-3 w-full"
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
                className="mobile-input px-3 py-3 w-full"
                required
                disabled={isPending}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Copas</label>
                <input
                  type="number"
                  value={userTrophies}
                  onChange={(e) => setUserTrophies(Number.parseInt(e.target.value) || 0)}
                  className="mobile-input px-3 py-3 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Oro</label>
                <input
                  type="number"
                  value={userGoldMedals}
                  onChange={(e) => setUserGoldMedals(Number.parseInt(e.target.value) || 0)}
                  className="mobile-input px-3 py-3 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Plata</label>
                <input
                  type="number"
                  value={userSilverMedals}
                  onChange={(e) => setUserSilverMedals(Number.parseInt(e.target.value) || 0)}
                  className="mobile-input px-3 py-3 w-full"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="text-white/70 block mb-2 text-sm font-medium">Bronce</label>
                <input
                  type="number"
                  value={userBronzeMedals}
                  onChange={(e) => setUserBronzeMedals(Number.parseInt(e.target.value) || 0)}
                  className="mobile-input px-3 py-3 w-full"
                  disabled={isPending}
                />
              </div>
            </div>
            <div>
              <label className="text-white/70 block mb-2 text-sm font-medium">Puntos Extra</label>
              <input
                type="number"
                value={userPoints}
                onChange={(e) => setUserPoints(Number.parseInt(e.target.value) || 0)}
                className="mobile-input px-3 py-3 w-full"
                disabled={isPending}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="accent-success text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
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
                className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
                disabled={isPending}
              >
                Cancelar
              </button>
            </div>
          </form>,
          "max-w-lg",
        )}

      {/* Modal agregar premio */}
      {renderModal(
        isAddCopaOpen,
        () => setIsAddCopaOpen(false),
        "Agregar Premio",
        <form onSubmit={handleAddCopa} className="space-y-4">
          <div>
            <label className="text-white/70 block mb-2 text-sm font-medium">Usuario</label>
            <select
              value={copaUserId}
              onChange={(e) => setCopaUserId(e.target.value)}
              className="mobile-select px-3 py-3 w-full"
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
              className="mobile-select px-3 py-3 w-full"
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
              className="mobile-input px-3 py-3 w-full"
              required
              disabled={isPending}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="accent-warning text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
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
              className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </form>,
      )}

      {/* Modal agregar hora */}
      {renderModal(
        isAddHoraOpen,
        () => setIsAddHoraOpen(false),
        "Agregar Hora",
        <form onSubmit={handleAddHora} className="space-y-4">
          <div>
            <label className="text-white/70 block mb-2 text-sm font-medium">Usuario</label>
            <select
              value={horaUserId}
              onChange={(e) => setHoraUserId(e.target.value)}
              className="mobile-select px-3 py-3 w-full"
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
              className="mobile-input px-3 py-3 w-full"
              required
              disabled={isPending}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="accent-info text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
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
              className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </form>,
      )}

      {/* Modal apostar */}
      {renderModal(
        isBetOpen,
        () => setIsBetOpen(false),
        "Apostar",
        <form onSubmit={handleAddBet} className="space-y-4">
          <div>
            <label className="text-white/70 block mb-2 text-sm font-medium">Tu Nombre</label>
            <input
              type="text"
              value={bettorName}
              onChange={(e) => setBettorName(e.target.value)}
              className="mobile-input px-3 py-3 w-full"
              required
              disabled={isPending}
              placeholder="¿Quién eres?"
            />
          </div>
          <div>
            <label className="text-white/70 block mb-2 text-sm font-medium">Ganador Predicho</label>
            <input
              type="text"
              value={predictedWinner}
              onChange={(e) => setPredictedWinner(e.target.value)}
              className="mobile-input px-3 py-3 w-full"
              required
              disabled={isPending}
              placeholder="¿Quién ganará?"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="accent-primary text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
              disabled={isPending}
            >
              Apostar
            </button>
            <button
              type="button"
              onClick={() => setIsBetOpen(false)}
              className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </form>,
      )}

      {/* Modal RIVALS */}
      {renderModal(
        isRivalsOpen,
        () => setIsRivalsOpen(false),
        "RIVALS QQ",
        <form onSubmit={handleAddRivals} className="space-y-4">
          <div>
            <label className="text-white/70 block mb-2 text-sm font-medium">Tu Nombre</label>
            <input
              type="text"
              value={rivalsBettorName}
              onChange={(e) => setRivalsBettorName(e.target.value)}
              className="mobile-input px-3 py-3 w-full"
              required
              disabled={isPending}
              placeholder="¿Quién eres?"
            />
          </div>
          <div>
            <label className="text-white/70 block mb-2 text-sm font-medium">Contra Quién Vas</label>
            <input
              type="text"
              value={rivalsTarget}
              onChange={(e) => setRivalsTarget(e.target.value)}
              className="mobile-input px-3 py-3 w-full"
              required
              disabled={isPending}
              placeholder="¿Quién NO ganará?"
            />
          </div>
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
            <p className="text-red-300 text-xs text-center">⚠️ Solo puedes apostar contra usuarios con puntos activos</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="accent-danger text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
              disabled={isPending}
            >
              RIVALS
            </button>
            <button
              type="button"
              onClick={() => setIsRivalsOpen(false)}
              className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button flex-1 text-sm"
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </form>,
      )}

      {/* Modal ¿Cómo funciona? */}
      {renderModal(
        isHowItWorksOpen,
        () => setIsHowItWorksOpen(false),
        "¿Cómo funciona?",
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Cada día, se mirará la hora en que se han dado los buenos días y eso será todo. Nadie debe hacer nada más.
            Bueno si, ¡apostad! son puntos casi seguros.
          </p>
          <p className="text-white/70 text-sm">El sistema asigna puntos según los siguientes criterios:</p>
          <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
            <li>Copa: {POINTS_SYSTEM.COPA} puntos</li>
            <li>Oro: {POINTS_SYSTEM.ORO} puntos</li>
            <li>Plata: {POINTS_SYSTEM.PLATA} punto</li>
            <li>Bronce: {POINTS_SYSTEM.BRONCE} puntos</li>
          </ul>
          <p className="text-white/70 text-sm">
            Al final de la temporada, el participante con más puntos es coronado como el campeón.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsHowItWorksOpen(false)}
              className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button w-full text-sm"
              disabled={isPending}
            >
              Entendido
            </button>
          </div>
        </div>,
        "max-w-lg",
      )}

      {/* Modal ¿Cómo funciona RIVALS? */}
      {renderModal(
        isRivalsHowItWorksOpen,
        () => setIsRivalsHowItWorksOpen(false),
        "RIVALS QQ - ¿Cómo funciona?",
        <div className="space-y-4">
          <p className="text-white/90 text-sm leading-relaxed">
            Bienvenido al modo RIVALS, en esta ocasión debes poner quien crees que NO ganará, ni la copa ni la medalla
            de oro. Sólo estas dos.
          </p>
          <p className="text-white/90 text-sm leading-relaxed">
            Si aciertas y esa persona NO gana ganas 10 puntos si pierdes se te restarán 3 puntos o volverás a 0.
          </p>
          <p className="text-white/90 text-sm leading-relaxed">
            SÓLO puedes ir en contra de gente que tenga puntos en su cuenta ya, no puede ser alguien inactivo en puntos.
          </p>
          <p className="text-red-300 text-sm font-medium text-center">Así que, di quien eres y por quien vas.</p>
          <div className="pt-2">
            <button
              onClick={() => setIsRivalsHowItWorksOpen(false)}
              className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button w-full text-sm"
              disabled={isPending}
            >
              Entendido
            </button>
          </div>
        </div>,
        "max-w-lg",
      )}

      {/* Modal normas */}
      {renderModal(
        isRulesOpen,
        () => setIsRulesOpen(false),
        "Normas del Juego",
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 glass-light rounded-lg border border-white/8">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="text-yellow-400">⚠️</span>
                Norma #1 - Participación Válida
              </h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Debes haber dormido/descansado realmente para participar en los premios al dar los buenos días antes que
                los demás. Intentar falsear esta norma puede tener penalización.
              </p>
            </div>

            <div className="p-3 glass-light rounded-lg border border-white/8">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="text-blue-400">🎯</span>
                Norma #2 - Apuestas y Rivals
              </h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Las apuestas y el modo rivals han de ser claros: tu nombre y el nombre de la otra persona. Si no es así,
                simplemente se deshará esa apuesta o vs.
              </p>
            </div>

            <div className="p-3 glass-light rounded-lg border border-white/8">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="text-green-400">🕕</span>
                Norma #3 - Horario de Buenos Días
              </h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Se tendrán en cuenta los buenos días a partir de las 6:00am. Más temprano no contará, ya ni que sea por
                salud o posible intento fraudulento.
              </p>
            </div>

            <div className="p-3 glass-light rounded-lg border border-white/8">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="text-purple-400">🕛</span>
                Norma #4 - Límite de Apuestas
              </h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Las apuestas o rivals puedes hacerlos hasta las 00:00. De pasarte de la hora será anotada para el día
                siguiente.
              </p>
            </div>

            <div className="p-3 glass-light rounded-lg border border-white/8">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="text-red-400">👤</span>
                Norma #5 - Usuarios No Registrados
              </h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Si un usuario no está en la base de datos, solicita añadirlo.
              </p>
            </div>

            <div className="p-3 glass-light rounded-lg border border-red-400/20 bg-red-500/10">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="text-red-400">⚔️</span>
                Norma #6 - RIVALS: Prohibido Auto-Voto
              </h4>
              <p className="text-red-300 text-xs leading-relaxed font-medium">
                En el modo RIVALS NO es válido votarse a sí mismo. No puedes apostar contra ti mismo para obtener puntos
                fáciles.
              </p>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setIsRulesOpen(false)}
              className="glass-light text-white px-4 py-3 rounded-lg font-medium touch-button w-full text-sm"
              disabled={isPending}
            >
              Entendido
            </button>
          </div>
        </div>,
        "max-w-2xl",
      )}

      {/* Overlay para modales móviles */}
      {isMobile &&
        (isAuthOpen ||
          isAddUserOpen ||
          isAddCopaOpen ||
          isAddHoraOpen ||
          editingUser ||
          isBetOpen ||
          isRivalsOpen ||
          isHowItWorksOpen ||
          isRivalsHowItWorksOpen ||
          isRulesOpen) && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => {
              setIsAuthOpen(false)
              setIsAddUserOpen(false)
              setIsAddCopaOpen(false)
              setIsAddHoraOpen(false)
              setEditingUser(null)
              setIsBetOpen(false)
              setIsRivalsOpen(false)
              setIsHowItWorksOpen(false)
              setIsRivalsHowItWorksOpen(false)
              setIsRulesOpen(false)
            }}
          />
        )}
    </div>
  )
}
