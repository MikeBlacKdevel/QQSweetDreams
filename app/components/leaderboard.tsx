"use client"

import { Trophy, Medal, Clock, Edit, Trash2, Plus } from "lucide-react"
import { memo, useMemo } from "react"
import type { User } from "../types"

interface LeaderboardProps {
  users: User[]
  isAuthenticated: boolean
  isPending: boolean
  onEditUser: (user: User) => void
  onDeleteUser: (id: number) => void
  onAddUser: () => void
  getTotalPoints: (user: User) => number
  getHoraMedia: (user: User) => string
}

const POINTS_SYSTEM = {
  COPA: 10,
  ORO: 5,
  PLATA: 3,
  BRONCE: 1,
} as const

// Memoized components for better performance
const PointsSystemCard = memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
    <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
      Sistema de Puntuación
    </h4>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[
        { icon: Trophy, label: "Copa", points: POINTS_SYSTEM.COPA, color: "text-yellow-500" },
        { icon: Medal, label: "Oro", points: POINTS_SYSTEM.ORO, color: "text-yellow-400" },
        { icon: Medal, label: "Plata", points: POINTS_SYSTEM.PLATA, color: "text-gray-400" },
        { icon: Medal, label: "Bronce", points: POINTS_SYSTEM.BRONCE, color: "text-amber-600" },
      ].map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color} mx-auto mb-2`} />
            <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.points} pts</div>
          </div>
        )
      })}
    </div>
  </div>
))

const RulesCard = memo(() => (
  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4">
    <div className="text-center">
      <p className="text-sm text-gray-900 dark:text-yellow-100 mb-2">
        <span className="text-lg mr-2">⚠️</span>
        <strong>Regla:</strong> Solo cuenta si has dormido. Pedro decide el premio.
      </p>
      <p className="text-xs text-green-600">🎁 Premio oculto de 50 puntos en la web</p>
    </div>
  </div>
))

const UserItem = memo(
  ({
    user,
    index,
    currentPoints,
    hasTie,
    isAuthenticated,
    isPending,
    onEditUser,
    onDeleteUser,
    getHoraMedia,
  }: {
    user: User
    index: number
    currentPoints: number
    hasTie: boolean
    isAuthenticated: boolean
    isPending: boolean
    onEditUser: (user: User) => void
    onDeleteUser: (id: number) => void
    getHoraMedia: (user: User) => string
  }) => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 leaderboard-item">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <div
              className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-sm font-bold ${
                index === 0 && !hasTie
                  ? "bg-yellow-100 text-yellow-800"
                  : index === 1 && !hasTie
                    ? "bg-gray-100 text-gray-800"
                    : index === 2 && !hasTie
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
              }`}
            >
              {index + 1}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate flex-1">
              {user.name}
            </h3>
            <div
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                currentPoints >= 100
                  ? "bg-yellow-100 text-yellow-800"
                  : currentPoints >= 50
                    ? "bg-gray-100 text-gray-800"
                    : currentPoints >= 25
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
              }`}
            >
              {currentPoints}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
              <span>{user.trophies}</span>
            </div>
            <div className="flex items-center gap-1">
              <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              <span>{user.gold_medals}</span>
            </div>
            <div className="flex items-center gap-1">
              <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <span>{user.silver_medals}</span>
            </div>
            <div className="flex items-center gap-1">
              <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
              <span>{user.bronze_medals}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span>{getHoraMedia(user)}</span>
            </div>
          </div>

          {user.name.toLowerCase().includes("dídac") && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-xs sm:text-sm text-green-800">
                🚨 Dídac ha recibido un premio de 50 puntos por haber vulnerado la seguridad de la web
              </p>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-1 sm:gap-2 ml-3 sm:ml-6">
            <button
              onClick={() => onEditUser(user)}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isPending}
              aria-label={`Editar ${user.name}`}
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => onDeleteUser(user.id)}
              className="p-1.5 sm:p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-md transition-colors"
              disabled={isPending}
              aria-label={`Eliminar ${user.name}`}
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  ),
)

export default function Leaderboard({
  users,
  isAuthenticated,
  isPending,
  onEditUser,
  onDeleteUser,
  onAddUser,
  getTotalPoints,
  getHoraMedia,
}: LeaderboardProps) {
  const sortedUsers = useMemo(
    () => [...users].filter((user) => getTotalPoints(user) > 0).sort((a, b) => getTotalPoints(b) - getTotalPoints(a)),
    [users, getTotalPoints],
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Clasificación</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 max-w-lg mx-auto card-glow">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Temporada 1 - Campeón
          </h2>
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3">Biker Outlet Week</div>
          <div className="w-12 h-px bg-gray-300 dark:bg-gray-700 mx-auto mb-3"></div>
          <h3 className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
            Temporada 2 - En Progreso
          </h3>
        </div>
      </div>

      {/* Points System */}
      <PointsSystemCard />

      {/* Rules */}
      <RulesCard />

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden card-glow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white text-center">Ranking</h2>
        </div>

        <div className="p-4 sm:p-6">
          {sortedUsers.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4 opacity-20">🏆</div>
              <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">Sin participantes</p>
              {isAuthenticated && (
                <button
                  onClick={onAddUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Usuario
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sortedUsers.map((user, index) => {
                const currentPoints = getTotalPoints(user)
                const previousPoints = index > 0 ? getTotalPoints(sortedUsers[index - 1]) : null
                const nextPoints = index < sortedUsers.length - 1 ? getTotalPoints(sortedUsers[index + 1]) : null
                const hasTie = previousPoints === currentPoints || nextPoints === currentPoints

                return (
                  <UserItem
                    key={user.id}
                    user={user}
                    index={index}
                    currentPoints={currentPoints}
                    hasTie={hasTie}
                    isAuthenticated={isAuthenticated}
                    isPending={isPending}
                    onEditUser={onEditUser}
                    onDeleteUser={onDeleteUser}
                    getHoraMedia={getHoraMedia}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
