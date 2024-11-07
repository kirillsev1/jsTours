-- DROP TABLE IF EXISTS "user", "tour", "review";

CREATE TABLE IF NOT EXISTS "user" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT UNIQUE,
    password TEXT,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "tour" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT,
    description TEXT,
    price INT
);

CREATE TABLE IF NOT EXISTS "review" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT REFERENCES "user"(id),
    tour_id INT REFERENCES "tour"(id),
    rating REAL,
    comment TEXT
);
