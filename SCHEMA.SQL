CREATE TABLE users (
  user_id       SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(15),
  gender        VARCHAR(10),
  created_at    TIMESTAMP DEFAULT NOW()
);
 
CREATE TABLE trips (
  trip_id       SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  departure     VARCHAR(100) NOT NULL,
  destination   VARCHAR(100) NOT NULL,
  budget        NUMERIC(10,2),
  group_size    INTEGER DEFAULT 1,
  duration_days INTEGER,
  trip_type     VARCHAR(50),
  created_at    TIMESTAMP DEFAULT NOW()
);