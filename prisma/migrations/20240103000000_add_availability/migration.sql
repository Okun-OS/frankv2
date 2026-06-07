CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "timeSlots" TEXT,
    "note" TEXT,
    "focusType" TEXT NOT NULL DEFAULT 'balanced',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Availability_date_key" ON "Availability"("date");
