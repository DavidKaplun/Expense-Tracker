-- CreateTable
CREATE TABLE "InvoiceUsage" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvoiceUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceUsage_user_id_year_month_key" ON "InvoiceUsage"("user_id", "year", "month");

-- AddForeignKey
ALTER TABLE "InvoiceUsage" ADD CONSTRAINT "InvoiceUsage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
