import type { User } from "../types"
import { POINTS_SYSTEM } from "../types"

export const getTotalPoints = (user: User): number => {
  return (
    user.trophies * POINTS_SYSTEM.COPA +
    user.gold_medals * POINTS_SYSTEM.ORO +
    user.silver_medals * POINTS_SYSTEM.PLATA +
    user.bronze_medals * POINTS_SYSTEM.BRONCE +
    user.points
  )
}

export const getHoraMedia = (user: User): string => {
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

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES")
}
