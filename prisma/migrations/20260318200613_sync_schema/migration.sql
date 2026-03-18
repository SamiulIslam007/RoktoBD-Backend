/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateOfBirth` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RequestedFor" AS ENUM ('SELF', 'FAMILY', 'FRIEND', 'OTHER');

-- CreateEnum
CREATE TYPE "HospitalResponseStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- AlterTable
ALTER TABLE "BloodRequest" ADD COLUMN     "patientName" TEXT,
ADD COLUMN     "requestedFor" "RequestedFor";

-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "cityId" TEXT,
ADD COLUMN     "districtId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "BloodReceipt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bloodRequestId" TEXT,

    CONSTRAINT "BloodReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HospitalRequestResponse" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "bloodRequestId" TEXT NOT NULL,
    "status" "HospitalResponseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HospitalRequestResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BloodReceipt_userId_idx" ON "BloodReceipt"("userId");

-- CreateIndex
CREATE INDEX "BloodReceipt_bloodRequestId_idx" ON "BloodReceipt"("bloodRequestId");

-- CreateIndex
CREATE INDEX "HospitalRequestResponse_hospitalId_idx" ON "HospitalRequestResponse"("hospitalId");

-- CreateIndex
CREATE INDEX "HospitalRequestResponse_bloodRequestId_idx" ON "HospitalRequestResponse"("bloodRequestId");

-- CreateIndex
CREATE INDEX "HospitalRequestResponse_status_idx" ON "HospitalRequestResponse"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalRequestResponse_hospitalId_bloodRequestId_key" ON "HospitalRequestResponse"("hospitalId", "bloodRequestId");

-- CreateIndex
CREATE INDEX "District_name_idx" ON "District"("name");

-- CreateIndex
CREATE INDEX "Hospital_districtId_idx" ON "Hospital"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodReceipt" ADD CONSTRAINT "BloodReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodReceipt" ADD CONSTRAINT "BloodReceipt_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "BloodRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalRequestResponse" ADD CONSTRAINT "HospitalRequestResponse_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalRequestResponse" ADD CONSTRAINT "HospitalRequestResponse_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "BloodRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
