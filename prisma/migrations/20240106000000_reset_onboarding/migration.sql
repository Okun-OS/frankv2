-- Reset onboarding so setup wizard runs again on next visit
UPDATE "User" SET "setupCompleted" = false;
DELETE FROM "FounderProfile";
