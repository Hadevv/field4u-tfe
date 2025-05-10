-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('GROUP', 'OWNER');

-- CreateTable
CREATE TABLE "messages" (
    "id" CHAR(21) NOT NULL,
    "gleaningId" CHAR(21) NOT NULL,
    "senderId" CHAR(21) NOT NULL,
    "type" "MessageType" NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_gleaningId_fkey" FOREIGN KEY ("gleaningId") REFERENCES "gleanings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
