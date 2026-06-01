-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "id_address" TEXT;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_id_address_fkey" FOREIGN KEY ("id_address") REFERENCES "Address"("id_address") ON DELETE SET NULL ON UPDATE CASCADE;
