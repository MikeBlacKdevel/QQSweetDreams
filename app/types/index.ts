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

export interface QQMejorAward {
  id: number
  user_id: number
  user_name: string
  description: string
  points: number
  created_at: string
}

export interface Penalization {
  id: number
  user_id: number
  user_name: string
  description: string
  points: number
  admin_name: string
  created_at: string
}

export interface PointsAdjustment {
  id: number
  user_id: number
  user_name: string
  points_before: number
  points_adjustment: number
  points_after: number
  adjustment_type: string
  reason: string
  admin_name: string
  created_at: string
}

export interface Props {
  initialUsers: User[]
  initialBets: Bet[]
  initialQQMejorAwards: QQMejorAward[]
  initialPenalizations: Penalization[]
  initialPointsAdjustments: PointsAdjustment[]
}

export const AWARD_TYPES = {
  COPA: "copa",
  ORO: "oro",
  PLATA: "plata",
  BRONCE: "bronce",
} as const

export const POINTS_SYSTEM = {
  COPA: 10,
  ORO: 5,
  PLATA: 3,
  BRONCE: 1,
} as const

export const INITIAL_TIME = "08:00"
// RXN0YSB3ZWIgZXN0YSB1c2FuZG8gZWwgZnJvbnRlbmQgcGFyYSB2ZXLDrWZpY2FyIGxhIGNvbnRyYXNlw7FhIGRlIGFkbWluLiBObyBoYXkgbsO6bWVybyBkZSBpbnRlbnRvcy4gRW4gZWwgY8OzZGlnbyBkZSBsYSB3ZWIgcHVlZGVzIHZlcmxvLiBZIHNpbm8gbGEgZnVlcnphIGJydXRhIHVzYXIu
export const ADMIN_PASSWORD = "!m2YieLN#HLJrbk^qz8n$yiJZjt40@QnmAR$aWjXUj&8#F9c*L"
