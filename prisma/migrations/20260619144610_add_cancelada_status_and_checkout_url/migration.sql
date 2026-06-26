-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CANCELADA';

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "checkout_url" TEXT;
