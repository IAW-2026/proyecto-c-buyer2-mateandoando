-- CreateTable
CREATE TABLE "PackageItem" (
    "id_package_item" TEXT NOT NULL,
    "id_package" TEXT NOT NULL,
    "id_item" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "PackageItem_pkey" PRIMARY KEY ("id_package_item")
);

-- AddForeignKey
ALTER TABLE "PackageItem" ADD CONSTRAINT "PackageItem_id_package_fkey" FOREIGN KEY ("id_package") REFERENCES "Package"("id_package") ON DELETE RESTRICT ON UPDATE CASCADE;
