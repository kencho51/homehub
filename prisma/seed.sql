-- Seed data for Family Hub D1 Database
-- Run with: npx wrangler d1 execute homehub-db --local --file=./prisma/seed.sql

-- Insert Admin User (password: admin123)
-- Hash generated with bcrypt, 10 rounds
INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Admin User',
  'admin@family-hub.com',
  '$2b$10$9Bzsri9GMlZyWpZFLoIIweGXJoTF4OqtlTQQ2SBsmB1gtthVoGDuO',
  'admin',
  datetime('now'),
  datetime('now')
);

-- Insert Test User 1 (password: test123)
INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'John Doe',
  'john@family-hub.com',
  '$2b$10$PBTY2BW8/TsDbhEfigkN7ey3vK6g03R0qYHjgQhTxt4zs0kppjbdu',
  'member',
  datetime('now'),
  datetime('now')
);

-- Insert Test User 2 (password: test123)
INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'Jane Smith',
  'jane@family-hub.com',
  '$2b$10$PBTY2BW8/TsDbhEfigkN7ey3vK6g03R0qYHjgQhTxt4zs0kppjbdu',
  'member',
  datetime('now'),
  datetime('now')
);

-- Insert Sample Calendar Event
INSERT INTO CalendarEvent (id, title, description, startDate, endDate, location, allDay, createdBy, createdAt, updatedAt)
VALUES (
  '660e8400-e29b-41d4-a716-446655440000',
  'Family Dinner',
  'Weekly family dinner at home',
  datetime('now', '+1 day'),
  datetime('now', '+1 day', '+2 hours'),
  'Home',
  0,
  '550e8400-e29b-41d4-a716-446655440000',
  datetime('now'),
  datetime('now')
);

-- Insert Sample Travel Plan
INSERT INTO TravelPlan (id, title, destination, description, startDate, endDate, itinerary, budget, createdBy, createdAt, updatedAt)
VALUES (
  '770e8400-e29b-41d4-a716-446655440000',
  'Summer Vacation',
  'Beach Resort',
  'Annual family summer vacation',
  datetime('now', '+30 days'),
  datetime('now', '+37 days'),
  '[{"day":1,"activity":"Arrival and check-in"},{"day":2,"activity":"Beach day"},{"day":3,"activity":"City tour"}]',
  5000.0,
  '550e8400-e29b-41d4-a716-446655440001',
  datetime('now'),
  datetime('now')
);

-- Insert Sample News Entry
INSERT INTO NewsEntry (id, title, content, createdBy, createdAt, updatedAt)
VALUES (
  '880e8400-e29b-41d4-a716-446655440000',
  'Welcome to Family Hub!',
  'We are excited to launch our new family hub application. Stay connected with calendar events, travel plans, and family news all in one place!',
  '550e8400-e29b-41d4-a716-446655440000',
  datetime('now'),
  datetime('now')
);

-- Verify data
SELECT 'Users:', COUNT(*) as count FROM User;
SELECT 'Calendar Events:', COUNT(*) as count FROM CalendarEvent;
SELECT 'Travel Plans:', COUNT(*) as count FROM TravelPlan;
SELECT 'News Entries:', COUNT(*) as count FROM NewsEntry;

