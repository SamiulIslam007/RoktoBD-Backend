/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DONOR', 'REQUESTER', 'HOSPITAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('WEB', 'MOBILE', 'WHATSAPP', 'EMAIL');

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fcmToken" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL,
ADD COLUMN     "webPushSubscription" JSONB,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "districtId" TEXT NOT NULL,
    "cityId" TEXT,
    "lastDonationDate" TIMESTAMP(3),
    "canDonateAfter" TIMESTAMP(3),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "address" TEXT,
    "contactPerson" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "urgency" "Urgency" NOT NULL DEFAULT 'MEDIUM',
    "location" TEXT,
    "hospitalName" TEXT,
    "contactPhone" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'OPEN',
    "districtId" TEXT,
    "cityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodStock" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'bag',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BloodStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bloodRequestId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "bloodRequestId" TEXT,
    "participant1Id" TEXT NOT NULL,
    "participant2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpVerification" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "City_districtId_idx" ON "City"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_userId_key" ON "Donor"("userId");

-- CreateIndex
CREATE INDEX "Donor_bloodGroup_idx" ON "Donor"("bloodGroup");

-- CreateIndex
CREATE INDEX "Donor_districtId_idx" ON "Donor"("districtId");

-- CreateIndex
CREATE INDEX "Donor_isAvailable_idx" ON "Donor"("isAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_userId_key" ON "Hospital"("userId");

-- CreateIndex
CREATE INDEX "Hospital_verified_idx" ON "Hospital"("verified");

-- CreateIndex
CREATE INDEX "BloodRequest_bloodGroup_idx" ON "BloodRequest"("bloodGroup");

-- CreateIndex
CREATE INDEX "BloodRequest_status_idx" ON "BloodRequest"("status");

-- CreateIndex
CREATE INDEX "BloodRequest_requesterId_idx" ON "BloodRequest"("requesterId");

-- CreateIndex
CREATE INDEX "BloodRequest_districtId_idx" ON "BloodRequest"("districtId");

-- CreateIndex
CREATE INDEX "BloodStock_bloodGroup_idx" ON "BloodStock"("bloodGroup");

-- CreateIndex
CREATE INDEX "BloodStock_hospitalId_idx" ON "BloodStock"("hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "BloodStock_hospitalId_bloodGroup_key" ON "BloodStock"("hospitalId", "bloodGroup");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_bloodRequestId_idx" ON "Notification"("bloodRequestId");

-- CreateIndex
CREATE INDEX "Chat_participant1Id_idx" ON "Chat"("participant1Id");

-- CreateIndex
CREATE INDEX "Chat_participant2Id_idx" ON "Chat"("participant2Id");

-- CreateIndex
CREATE INDEX "Chat_bloodRequestId_idx" ON "Chat"("bloodRequestId");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "OtpVerification_phone_idx" ON "OtpVerification"("phone");

-- CreateIndex
CREATE INDEX "OtpVerification_expiresAt_idx" ON "OtpVerification"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodStock" ADD CONSTRAINT "BloodStock_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "BloodRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "BloodRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
