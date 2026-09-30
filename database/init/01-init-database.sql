-- La-Tike database initialization
--
-- Postgres runs this once, when the data volume is first created and before
-- the API has applied any Prisma migrations. Tables, indexes and views belong
-- in Prisma migrations (server/prisma/migrations), not here, because the
-- tables do not exist yet at this point.

-- Trigram indexes for fast case-insensitive event search (ILIKE '%term%')
CREATE EXTENSION IF NOT EXISTS pg_trgm;
