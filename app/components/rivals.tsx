"use client"

import type { Bet, User } from "../types"

interface RivalsProps {
  bets: Bet[]
  users: User[]
  isAuthenticated: boolean
  isPending: boolean
  onOpenRivals: () => void
  onRivalsHowItWorks: () => void
  onManageRivals: () => void
  getTotalPoints: (user: User) => number
}

export default function Rivals({
  bets,
  users,
  isAuthenticated,
  isPending,
  onOpenRivals,
  onRivalsHowItWorks,
  onManageRivals,
  getTotalPoints,
}: RivalsProps) {
  const rivalsBets = bets.filter((bet) => bet.predicted_winner.startsWith("RIVALS:"))

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">RIVALS QQ</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Apuesta contra quien crees que NO ganará la copa o medalla de oro.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-green-800 mb-1">✅ Acierto</div>
              <div className="text-xs text-green-600">+10 puntos</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-red-800 mb-1">❌ Error</div>
              <div className="text-xs text-red-600">-5 puntos</div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Restricción</div>
            <div className="text-xs text-yellow-600">Solo contra usuarios con puntos activos</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onRivalsHowItWorks}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ¿Cómo funciona?
        </button>
        <button
          onClick={onOpenRivals}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 btn-glow"
          disabled={isPending}
        >
          🔥 RIVALS
        </button>
      </div>

      {isAuthenticated && (
        <div className="text-center">
          <button
            onClick={onManageRivals}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          >
            🎯 Gestionar RIVALS
          </button>
        </div>
      )}

      {rivalsBets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">RIVALS Activos</h3>
          <div className="space-y-3">
            {rivalsBets.map((bet) => (
              <div
                key={bet.id}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {bet.bettor_name}
                    </span>
                    <span className="text-red-600 font-bold">VS</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {bet.predicted_winner.replace("RIVALS: ", "")}
                    </span>
                    {bet.status !== "pending" && (
                      <span
                        className={`ml-auto px-2 py-1 text-xs font-medium rounded-full ${
                          bet.status === "won" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bet.status === "won" ? `+${bet.points_awarded}` : bet.points_awarded}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
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
}
