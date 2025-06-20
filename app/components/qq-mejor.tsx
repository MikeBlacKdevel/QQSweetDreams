"use client"

import { Heart } from "lucide-react"
import type { QQMejorAward } from "../types"

interface QQMejorProps {
  qqMejorAwards: QQMejorAward[]
  isAuthenticated: boolean
  onOpenQQMejor: () => void
  onQQMejorAward: () => void
}

export default function QQMejor({ qqMejorAwards, isAuthenticated, onOpenQQMejor, onQQMejorAward }: QQMejorProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Para un QQ mejor</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Construyendo una mejor comunidad
            </span>
            <Heart className="w-6 h-6 text-pink-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            La banca premiará las buenas acciones que fortalezcan nuestra comunidad QQ.
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={onOpenQQMejor}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              💝 Ver ejemplos de buenas acciones
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-purple-800 mb-1">💝 Ayuda y Colaboración</div>
              <div className="text-xs text-purple-600">Puntos variables</div>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-pink-800 mb-1">🌟 Participación Activa</div>
              <div className="text-xs text-pink-600">Puntos variables</div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-yellow-800 mb-1">🏦 Decisión de la Banca</div>
            <div className="text-xs text-yellow-600">Los premios son determinados por la administración</div>
          </div>

          {isAuthenticated && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onQQMejorAward}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <Heart className="w-4 h-4 mr-2" />
                Otorgar Premio QQ Mejor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sección de Premios Otorgados */}
      {qqMejorAwards.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Premios QQ Mejor Otorgados
            <Heart className="w-5 h-5 text-pink-500" />
          </h3>
          <div className="space-y-4">
            {qqMejorAwards.map((award) => (
              <div
                key={award.id}
                className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">{award.user_name}</span>
                      </div>
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        +{award.points} pts
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{award.description}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(award.created_at).toLocaleDateString("es-ES", {
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
            ))}
          </div>
        </div>
      )}

      {qqMejorAwards.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 card-glow">
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">Aún no se han otorgado premios QQ Mejor</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              ¡Sé el primero en hacer algo bueno por la comunidad!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
