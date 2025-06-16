"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
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

export interface Bet {
  id: number
  bettor_name: string
  predicted_winner: string
  bet_date: string
  status: string
  points_awarded: number
  created_at: string
}

async function ensureTablesExist() {
  try {
    // Create all tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(50) NOT NULL,
        trophies INTEGER DEFAULT 0,
        gold_medals INTEGER DEFAULT 0,
        silver_medals INTEGER DEFAULT 0,
        bronze_medals INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS user_hours (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        hour_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS awards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        award_type VARCHAR(20) NOT NULL,
        hour_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS bets (
        id SERIAL PRIMARY KEY,
        bettor_name VARCHAR(255) NOT NULL,
        predicted_winner VARCHAR(255) NOT NULL,
        bet_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'pending',
        points_awarded INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  } catch (error) {
    console.error("Error creating tables:", error)
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    // Ensure tables exist
    await ensureTablesExist()

    // Now get users
    const users = await sql`
      SELECT id, name, whatsapp, trophies, gold_medals, silver_medals, bronze_medals, points
      FROM users
      ORDER BY (trophies * 3 + gold_medals * 2 + silver_medals * 1 + bronze_medals * 0.5 + points) DESC
    `

    // Get hours for each user
    const usersWithHours = await Promise.all(
      users.map(async (user) => {
        const hours = await sql`
          SELECT hour_time
          FROM user_hours
          WHERE user_id = ${user.id}
          ORDER BY created_at DESC
        `

        return {
          ...user,
          horas: hours.map((h) => h.hour_time),
        }
      }),
    )

    return usersWithHours
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

export async function getBets(): Promise<Bet[]> {
  try {
    // Ensure tables exist
    await ensureTablesExist()

    const bets = await sql`
      SELECT id, bettor_name, predicted_winner, bet_date, status, points_awarded, created_at
      FROM bets
      ORDER BY created_at DESC
    `

    return bets.map((bet) => ({
      ...bet,
      bet_date: bet.bet_date ? bet.bet_date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      created_at: bet.created_at ? bet.created_at.toISOString() : new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error getting bets:", error)
    return []
  }
}

export async function addUser(formData: FormData) {
  try {
    await ensureTablesExist()

    const name = formData.get("name") as string
    const whatsapp = formData.get("whatsapp") as string
    const trophies = Number.parseInt(formData.get("trophies") as string) || 0
    const goldMedals = Number.parseInt(formData.get("goldMedals") as string) || 0
    const silverMedals = Number.parseInt(formData.get("silverMedals") as string) || 0
    const bronzeMedals = Number.parseInt(formData.get("bronzeMedals") as string) || 0
    const points = Number.parseInt(formData.get("points") as string) || 0

    if (!name || !whatsapp) {
      throw new Error("Nombre y WhatsApp son requeridos")
    }

    await sql`
      INSERT INTO users (name, whatsapp, trophies, gold_medals, silver_medals, bronze_medals, points)
      VALUES (${name}, ${whatsapp}, ${trophies}, ${goldMedals}, ${silverMedals}, ${bronzeMedals}, ${points})
    `

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error adding user:", error)
    return { success: false, error: "Error al agregar usuario" }
  }
}

export async function updateUser(formData: FormData) {
  try {
    await ensureTablesExist()

    const id = Number.parseInt(formData.get("id") as string)
    const name = formData.get("name") as string
    const whatsapp = formData.get("whatsapp") as string
    const trophies = Number.parseInt(formData.get("trophies") as string) || 0
    const goldMedals = Number.parseInt(formData.get("goldMedals") as string) || 0
    const silverMedals = Number.parseInt(formData.get("silverMedals") as string) || 0
    const bronzeMedals = Number.parseInt(formData.get("bronzeMedals") as string) || 0
    const points = Number.parseInt(formData.get("points") as string) || 0

    if (!name || !whatsapp) {
      throw new Error("Nombre y WhatsApp son requeridos")
    }

    await sql`
      UPDATE users 
      SET name = ${name}, whatsapp = ${whatsapp}, trophies = ${trophies}, 
          gold_medals = ${goldMedals}, silver_medals = ${silverMedals}, 
          bronze_medals = ${bronzeMedals}, points = ${points},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Error al actualizar usuario" }
  }
}

export async function deleteUser(userId: number) {
  try {
    await ensureTablesExist()

    await sql`DELETE FROM users WHERE id = ${userId}`
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Error al eliminar usuario" }
  }
}

export async function addAward(formData: FormData) {
  try {
    await ensureTablesExist()

    const userId = Number.parseInt(formData.get("userId") as string)
    const awardType = formData.get("awardType") as string
    const hourTime = formData.get("hourTime") as string

    if (!userId || !awardType || !hourTime) {
      throw new Error("Todos los campos son requeridos")
    }

    // Insertar el premio en el historial
    await sql`
      INSERT INTO awards (user_id, award_type, hour_time)
      VALUES (${userId}, ${awardType}, ${hourTime})
    `

    // Insertar la hora
    await sql`
      INSERT INTO user_hours (user_id, hour_time)
      VALUES (${userId}, ${hourTime})
    `

    // Actualizar contadores del usuario
    if (awardType === "copa") {
      await sql`UPDATE users SET trophies = trophies + 1 WHERE id = ${userId}`
    } else if (awardType === "oro") {
      await sql`UPDATE users SET gold_medals = gold_medals + 1 WHERE id = ${userId}`
    } else if (awardType === "plata") {
      await sql`UPDATE users SET silver_medals = silver_medals + 1 WHERE id = ${userId}`
    } else if (awardType === "bronce") {
      await sql`UPDATE users SET bronze_medals = bronze_medals + 1 WHERE id = ${userId}`
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error adding award:", error)
    return { success: false, error: "Error al agregar premio" }
  }
}

export async function addHour(formData: FormData) {
  try {
    await ensureTablesExist()

    const userId = Number.parseInt(formData.get("userId") as string)
    const hourTime = formData.get("hourTime") as string

    if (!userId || !hourTime) {
      throw new Error("Usuario y hora son requeridos")
    }

    await sql`
      INSERT INTO user_hours (user_id, hour_time)
      VALUES (${userId}, ${hourTime})
    `

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error adding hour:", error)
    return { success: false, error: "Error al agregar hora" }
  }
}

export async function addBet(formData: FormData) {
  try {
    await ensureTablesExist()

    const bettorName = formData.get("bettorName") as string
    const predictedWinner = formData.get("predictedWinner") as string

    if (!bettorName || !predictedWinner) {
      throw new Error("Nombre del apostador y ganador predicho son requeridos")
    }

    await sql`
      INSERT INTO bets (bettor_name, predicted_winner)
      VALUES (${bettorName}, ${predictedWinner})
    `

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error adding bet:", error)
    return { success: false, error: "Error al agregar apuesta" }
  }
}

export async function updateBet(formData: FormData) {
  try {
    await ensureTablesExist()

    const id = Number.parseInt(formData.get("id") as string)
    const bettorName = formData.get("bettorName") as string
    const predictedWinner = formData.get("predictedWinner") as string
    const status = formData.get("status") as string
    const pointsAwarded = Number.parseInt(formData.get("pointsAwarded") as string) || 0

    if (!bettorName || !predictedWinner) {
      throw new Error("Nombre del apostador y ganador predicho son requeridos")
    }

    await sql`
      UPDATE bets 
      SET bettor_name = ${bettorName}, predicted_winner = ${predictedWinner}, 
          status = ${status}, points_awarded = ${pointsAwarded},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating bet:", error)
    return { success: false, error: "Error al actualizar apuesta" }
  }
}

export async function deleteBet(betId: number) {
  try {
    await ensureTablesExist()

    await sql`DELETE FROM bets WHERE id = ${betId}`
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting bet:", error)
    return { success: false, error: "Error al eliminar apuesta" }
  }
}
