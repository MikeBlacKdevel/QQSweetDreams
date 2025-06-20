import { Suspense } from "react"
import {
  getUsers,
  getBets,
  getQQMejorAwardsDetailed,
  getPenalizationsDetailed,
  getPointsAdjustmentsHistory,
} from "./actions"
import MarcadorClient from "./marcador-client"

export default async function Marcador() {
  const [users, bets, qqMejorAwards, penalizations, pointsAdjustments] = await Promise.all([
    getUsers(),
    getBets(),
    getQQMejorAwardsDetailed(),
    getPenalizationsDetailed(),
    getPointsAdjustmentsHistory(),
  ])

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-xl">Cargando marcador...</p>
          </div>
        </div>
      }
    >
      <MarcadorClient
        initialUsers={users}
        initialBets={bets}
        initialQQMejorAwards={qqMejorAwards}
        initialPenalizations={penalizations}
        initialPointsAdjustments={pointsAdjustments}
      />
    </Suspense>
  )
}
