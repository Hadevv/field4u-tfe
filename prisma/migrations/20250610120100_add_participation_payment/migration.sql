-- CreateTable
CREATE TABLE "participation_payments" (
  "id" CHAR(21) NOT NULL,
  "participation_id" CHAR(21) NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "payment_intent_id" VARCHAR(255) NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "participation_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participation_payments_payment_intent_id_key" ON "participation_payments"("payment_intent_id");

-- AddForeignKey
ALTER TABLE "participation_payments" ADD CONSTRAINT "participation_payments_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "participations"("id") ON DELETE CASCADE ON UPDATE CASCADE; 