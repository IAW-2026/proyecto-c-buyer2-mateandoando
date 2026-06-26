-- CreateEnum
CREATE TYPE "BuyerStatus" AS ENUM ('ACTIVO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO');

-- CreateTable
CREATE TABLE "Buyer" (
    "id_buyer" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "status" "BuyerStatus" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id_buyer")
);

-- CreateTable
CREATE TABLE "Address" (
    "id_address" TEXT NOT NULL,
    "id_buyer" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "floor_apt" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id_address")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id_cart" TEXT NOT NULL,
    "id_buyer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id_cart")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id_cart_item" TEXT NOT NULL,
    "id_cart" TEXT NOT NULL,
    "id_item" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id_cart_item")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id_purchase_order" TEXT NOT NULL,
    "id_buyer" TEXT NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDIENTE',
    "id_payment_operation" TEXT,
    "payment_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id_purchase_order")
);

-- CreateTable
CREATE TABLE "Package" (
    "id_package" TEXT NOT NULL,
    "id_purchase_order" TEXT NOT NULL,
    "id_seller" TEXT NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id_package")
);

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_clerk_user_id_key" ON "Buyer"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_id_buyer_key" ON "Cart"("id_buyer");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_id_buyer_fkey" FOREIGN KEY ("id_buyer") REFERENCES "Buyer"("id_buyer") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_id_buyer_fkey" FOREIGN KEY ("id_buyer") REFERENCES "Buyer"("id_buyer") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_id_cart_fkey" FOREIGN KEY ("id_cart") REFERENCES "Cart"("id_cart") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_id_buyer_fkey" FOREIGN KEY ("id_buyer") REFERENCES "Buyer"("id_buyer") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_id_purchase_order_fkey" FOREIGN KEY ("id_purchase_order") REFERENCES "PurchaseOrder"("id_purchase_order") ON DELETE RESTRICT ON UPDATE CASCADE;
