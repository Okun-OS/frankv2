ALTER TABLE "User" ADD COLUMN "setupCompleted" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "FounderProfile" (
    "id" TEXT NOT NULL,
    "founderName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyDescription" TEXT NOT NULL,
    "targetCustomers" TEXT NOT NULL,
    "offers" TEXT NOT NULL,
    "currentRevenue" TEXT,
    "currentCustomers" TEXT,
    "acquisitionChannels" TEXT NOT NULL,
    "biggestGoal" TEXT NOT NULL,
    "biggestChallenge" TEXT NOT NULL,
    "workingHoursPerDay" INTEGER NOT NULL DEFAULT 8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FounderProfile_pkey" PRIMARY KEY ("id")
);
