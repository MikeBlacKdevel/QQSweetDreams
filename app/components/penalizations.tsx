"use client"

import { AlertTriangle, Shield } from "lucide-react"
import type { Penalization } from "../types"

interface PenalizationsProps {
  penalizations: Penalization[]
  isAuthenticated: boolean
  onOpenPenalizations: () => void
  onPenalizationAward: () => void
}

export default function Penalizations({
  penalizations,
  isAuthenticated,
  onOpenPenalizations,
  onPenalizationAward,
}: PenalizationsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Penalizaciones</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Manteniendo la comunidad saludable
            </span>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Los administradores pueden aplicar penalizaciones por comportamientos que dañen la comunidad QQ.
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={onOpenPenalizations}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ⚠️ Ver ejemplos de comportamientos penalizables
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-red-800 mb-1">🚫 Comportamiento Tóxico</div>
              <div className="text-xs text-red-600">Puntos variables</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-orange-800 mb-1">📱 Mal Uso del Grupo</div>
              <div className="text-xs text-orange-600">Puntos variables</div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-yellow-800 mb-1">👮 Decisión de Administradores</div>
            <div className="text-xs text-yellow-600">Pedro Llanes, Vince y otros administradores autorizados</div>
          </div>

          {isAuthenticated && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onPenalizationAward}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Aplicar Penalización
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sección de Penalizaciones Aplicadas */}
      {penalizations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Penalizaciones Aplicadas
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </h3>
          <div className="space-y-4">
            {penalizations.map((penalization) => (
              <div
                key={penalization.id}
                className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">{penalization.user_name}</span>
                      </div>
                      <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">
                        -{penalization.points} pts
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                      {penalization.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Admin: {penalization.admin_name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(penalization.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {penalizations.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-green-300 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">¡Excelente! No hay penalizaciones aplicadas</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              La comunidad se está comportando de manera ejemplar
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
