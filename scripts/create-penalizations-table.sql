-- Crear tabla de penalizaciones
CREATE TABLE IF NOT EXISTS penalizations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  points INTEGER NOT NULL,
  admin_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
