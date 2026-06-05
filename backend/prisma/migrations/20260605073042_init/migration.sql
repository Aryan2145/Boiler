-- CreateEnum
CREATE TYPE "GovtRole" AS ENUM ('ADMIN', 'DIRECTOR', 'DEPUTY_DIRECTOR', 'ASSISTANT_DIRECTOR');

-- CreateTable
CREATE TABLE "contractors" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contractors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "govt_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "GovtRole" NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "govt_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contractors_licenseNo_key" ON "contractors"("licenseNo");

-- CreateIndex
CREATE UNIQUE INDEX "contractors_email_key" ON "contractors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "govt_users_email_key" ON "govt_users"("email");
