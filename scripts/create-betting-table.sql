-- Crear tabla de apuestas
CREATE TABLE IF NOT EXISTS bets (
  id SERIAL PRIMARY KEY,
  bettor_name VARCHAR(255) NOT NULL,
  predicted_winner VARCHAR(255) NOT NULL,
  bet_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'won', 'lost'
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
