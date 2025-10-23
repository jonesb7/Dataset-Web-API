-- Movie Database SQL Initialization Script
-- This script creates all tables based on the ER diagram and includes data migration queries

-- ============================================================================
-- DROP EXISTING TABLES (Optional - uncomment if needed for testing)
-- ============================================================================
-- DROP TABLE IF EXISTS movie_crew CASCADE;
-- DROP TABLE IF EXISTS movie_cast CASCADE;
-- DROP TABLE IF EXISTS movie_genre CASCADE;
-- DROP TABLE IF EXISTS movie CASCADE;
-- DROP TABLE IF EXISTS role CASCADE;
-- DROP TABLE IF EXISTS studio CASCADE;
-- DROP TABLE IF EXISTS person CASCADE;
-- DROP TABLE IF EXISTS genre CASCADE;
-- DROP TABLE IF EXISTS collection CASCADE;

-- ============================================================================
-- CREATE LOOKUP/REFERENCE TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS collection (
  collection_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS genre (
  genre_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS person (
  person_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  profile_url VARCHAR(500),
  biography TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS studio (
  studio_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(100),
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role (
  role_id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CREATE MAIN ENTITY TABLE
-- ============================================================================
-- ============================================================================
-- CREATE MAIN ENTITY TABLE with extended columns (no country column)
-- ============================================================================

CREATE TABLE IF NOT EXISTS movie (
                                     movie_id SERIAL PRIMARY KEY,
                                     title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    release_date DATE,
    runtime INT,
    genres TEXT,             -- semicolon-separated strings
    overview TEXT,
    budget BIGINT,
    revenue BIGINT,
    studios TEXT,            -- semicolon-separated strings
    producers TEXT,          -- semicolon-separated strings
    directors TEXT,          -- semicolon-separated strings
    mpa_rating VARCHAR(10),
    collection VARCHAR(255),
    poster_url VARCHAR(500),
    backdrop_url VARCHAR(500),
    studio_logos TEXT,       -- semicolon-separated strings
    studio_countries TEXT,   -- semicolon-separated strings

    actor1_name VARCHAR(255),
    actor1_character VARCHAR(255),
    actor1_profile VARCHAR(500),

    actor2_name VARCHAR(255),
    actor2_character VARCHAR(255),
    actor2_profile VARCHAR(500),

    actor3_name VARCHAR(255),
    actor3_character VARCHAR(255),
    actor3_profile VARCHAR(500),

    actor4_name VARCHAR(255),
    actor4_character VARCHAR(255),
    actor4_profile VARCHAR(500),

    actor5_name VARCHAR(255),
    actor5_character VARCHAR(255),
    actor5_profile VARCHAR(500),

    actor6_name VARCHAR(255),
    actor6_character VARCHAR(255),
    actor6_profile VARCHAR(500),

    actor7_name VARCHAR(255),
    actor7_character VARCHAR(255),
    actor7_profile VARCHAR(500),

    actor8_name VARCHAR(255),
    actor8_character VARCHAR(255),
    actor8_profile VARCHAR(500),

    actor9_name VARCHAR(255),
    actor9_character VARCHAR(255),
    actor9_profile VARCHAR(500),

    actor10_name VARCHAR(255),
    actor10_character VARCHAR(255),
    actor10_profile VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


-- ============================================================================
-- CREATE JUNCTION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS movie_genre (
  movie_genre_id SERIAL PRIMARY KEY,
  movie_id INT NOT NULL REFERENCES movie(movie_id) ON DELETE CASCADE,
  genre_id INT NOT NULL REFERENCES genre(genre_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(movie_id, genre_id)
);

CREATE TABLE IF NOT EXISTS movie_cast (
  cast_id SERIAL PRIMARY KEY,
  movie_id INT NOT NULL REFERENCES movie(movie_id) ON DELETE CASCADE,
  person_id INT NOT NULL REFERENCES person(person_id) ON DELETE CASCADE,
  character_name VARCHAR(255),
  cast_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(movie_id, person_id, character_name)
);

CREATE TABLE IF NOT EXISTS movie_crew (
  crew_id SERIAL PRIMARY KEY,
  movie_id INT NOT NULL REFERENCES movie(movie_id) ON DELETE CASCADE,
  person_id INT NOT NULL REFERENCES person(person_id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES role(role_id) ON DELETE CASCADE,
  department VARCHAR(100),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(movie_id, person_id, role_id)
);

-- ============================================================================
-- CREATE INDEXES FOR BETTER QUERY PERFORMANCE
-- ============================================================================

CREATE INDEX idx_movie_collection_id ON movie(collection_id);
CREATE INDEX idx_movie_studio_id ON movie(studio_id);
CREATE INDEX idx_movie_release_date ON movie(release_date);
CREATE INDEX idx_movie_genre_movie_id ON movie_genre(movie_id);
CREATE INDEX idx_movie_genre_genre_id ON movie_genre(genre_id);
CREATE INDEX idx_movie_cast_movie_id ON movie_cast(movie_id);
CREATE INDEX idx_movie_cast_person_id ON movie_cast(person_id);
CREATE INDEX idx_movie_crew_movie_id ON movie_crew(movie_id);
CREATE INDEX idx_movie_crew_person_id ON movie_crew(person_id);
CREATE INDEX idx_movie_crew_role_id ON movie_crew(role_id);

-- ============================================================================
-- DATA MIGRATION QUERIES
-- ============================================================================
-- NOTE: These queries assume you have a source table or CSV import with the raw data.
-- Adjust column names and table names based on your actual dataset file structure.

-- Example: If importing from a CSV file or temporary table with raw movie data
-- You would use INSERT INTO ... SELECT queries

-- 1. MIGRATE ROLES (assuming these are predefined in your dataset)
-- If your dataset has a roles column, extract unique values
-- INSERT INTO role (title, description)
-- SELECT DISTINCT role_name, NULL FROM raw_crew_data
-- WHERE role_name IS NOT NULL
-- ON CONFLICT (title) DO NOTHING;

-- Example roles that typically exist in movie datasets:
INSERT INTO role (title, description) VALUES
('Director', 'Directs the film'),
('Producer', 'Produces the film'),
('Writer', 'Writes the screenplay'),
('Actor', 'Performs in the film'),
('Cinematographer', 'Handles camera and lighting'),
('Editor', 'Edits the film'),
('Composer', 'Creates the musical score'),
('Production Designer', 'Designs the visual style')
ON CONFLICT (title) DO NOTHING;

-- 2. MIGRATE STUDIOS (from raw movie data)
-- INSERT INTO studio (name, country, logo_url)
-- SELECT DISTINCT studio_name, studio_country, studio_logo_url FROM raw_movie_data
-- WHERE studio_name IS NOT NULL
-- ON CONFLICT (name) DO NOTHING;

-- 3. MIGRATE GENRES
-- INSERT INTO genre (name, description)
-- SELECT DISTINCT genre_name, NULL FROM raw_genre_data
-- WHERE genre_name IS NOT NULL
-- ON CONFLICT (name) DO NOTHING;

-- 4. MIGRATE COLLECTIONS (if your dataset includes series/franchises)
-- INSERT INTO collection (name, description)
-- SELECT DISTINCT collection_name, collection_description FROM raw_movie_data
-- WHERE collection_name IS NOT NULL
-- ON CONFLICT (name) DO NOTHING;

-- 5. MIGRATE PEOPLE (actors, directors, producers)
-- INSERT INTO person (name, profile_url, biography)
-- SELECT DISTINCT person_name, person_profile_url, person_bio FROM raw_person_data
-- WHERE person_name IS NOT NULL
-- ON CONFLICT DO NOTHING;

-- 6. MIGRATE MOVIES
-- INSERT INTO movie (
--   title, original_title, release_date, runtime, budget, revenue,
--   mpa_rating, overview, poster_url, backdrop_url, studio_id, collection_id
-- )
-- SELECT
--   m.movie_title,
--   m.original_title,
--   m.release_date,
--   m.runtime,
--   m.budget,
--   m.revenue,
--   m.mpa_rating,
--   m.overview,
--   m.poster_url,
--   m.backdrop_url,
--   s.studio_id,
--   c.collection_id
-- FROM raw_movie_data m
-- LEFT JOIN studio s ON m.studio_name = s.name
-- LEFT JOIN collection c ON m.collection_name = c.name
-- WHERE m.movie_title IS NOT NULL;

-- 7. MIGRATE MOVIE_GENRE (linking movies to genres)
-- INSERT INTO movie_genre (movie_id, genre_id)
-- SELECT DISTINCT
--   m.movie_id,
--   g.genre_id
-- FROM raw_genre_data rg
-- JOIN movie m ON rg.movie_id = m.movie_id
-- JOIN genre g ON rg.genre_name = g.name
-- WHERE g.genre_id IS NOT NULL
-- ON CONFLICT (movie_id, genre_id) DO NOTHING;

-- 8. MIGRATE MOVIE_CAST (linking actors to movies)
-- INSERT INTO movie_cast (movie_id, person_id, character_name, cast_order)
-- SELECT DISTINCT
--   m.movie_id,
--   p.person_id,
--   mc.character_name,
--   mc.cast_order
-- FROM raw_cast_data mc
-- JOIN movie m ON mc.movie_id = m.movie_id
-- JOIN person p ON mc.person_name = p.name
-- WHERE p.person_id IS NOT NULL
-- ON CONFLICT (movie_id, person_id, character_name) DO NOTHING;

-- 9. MIGRATE MOVIE_CREW (linking crew members to movies)
-- INSERT INTO movie_crew (movie_id, person_id, role_id, department, start_date, end_date)
-- SELECT DISTINCT
--   m.movie_id,
--   p.person_id,
--   r.role_id,
--   mcr.department,
--   mcr.start_date,
--   mcr.end_date
-- FROM raw_crew_data mcr
-- JOIN movie m ON mcr.movie_id = m.movie_id
-- JOIN person p ON mcr.person_name = p.name
-- JOIN role r ON mcr.role_title = r.title
-- WHERE p.person_id IS NOT NULL AND r.role_id IS NOT NULL
-- ON CONFLICT (movie_id, person_id, role_id) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to check data integrity)
-- ============================================================================

-- Count records in each table
-- SELECT 
--   'collection' as table_name, COUNT(*) as count FROM collection
-- UNION ALL
-- SELECT 'genre', COUNT(*) FROM genre
-- UNION ALL
-- SELECT 'person', COUNT(*) FROM person
-- UNION ALL
-- SELECT 'studio', COUNT(*) FROM studio
-- UNION ALL
-- SELECT 'role', COUNT(*) FROM role
-- UNION ALL
-- SELECT 'movie', COUNT(*) FROM movie
-- UNION ALL
-- SELECT 'movie_genre', COUNT(*) FROM movie_genre
-- UNION ALL
-- SELECT 'movie_cast', COUNT(*) FROM movie_cast
-- UNION ALL
-- SELECT 'movie_crew', COUNT(*) FROM movie_crew;

-- Check for any orphaned foreign keys
-- SELECT m.movie_id, m.title FROM movie m
-- WHERE m.studio_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM studio s WHERE s.studio_id = m.studio_id);

-- Sample data query (testing relationships)
-- SELECT 
--   m.title,
--   s.name as studio,
--   g.name as genre,
--   p.name as actor,
--   mc.character_name
-- FROM movie m
-- LEFT JOIN studio s ON m.studio_id = s.studio_id
-- LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
-- LEFT JOIN genre g ON mg.genre_id = g.genre_id
-- LEFT JOIN movie_cast mc ON m.movie_id = mc.movie_id
-- LEFT JOIN person p ON mc.person_id = p.person_id
-- LIMIT 10;