CREATE TABLE USERS(
    id SERIAL PRIMARY KEY,
    username TEXT CHECK (LENGTH(username) >= 4 AND LENGTH(username) <= 20),
    password TEXT CHECK (LENGTH(password) >= 4 AND LENGTH(password) <= 100),
    role TEXT NOT NULL,
    createdAt DATE,
    updatedAt DATE
);