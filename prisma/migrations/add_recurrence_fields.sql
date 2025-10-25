-- Migration: Add recurrence fields to CalendarEvent
-- Run with: npx wrangler d1 execute homehub-db --local --file=./prisma/migrations/add_recurrence_fields.sql
-- For production: npx wrangler d1 execute homehub-db --remote --file=./prisma/migrations/add_recurrence_fields.sql

-- Add isRecurring field
ALTER TABLE CalendarEvent ADD COLUMN isRecurring BOOLEAN NOT NULL DEFAULT 0;

-- Add recurrencePattern field (JSON string)
ALTER TABLE CalendarEvent ADD COLUMN recurrencePattern TEXT;

-- Verify the changes
SELECT 'Migration completed. CalendarEvent table structure:';
PRAGMA table_info(CalendarEvent);

