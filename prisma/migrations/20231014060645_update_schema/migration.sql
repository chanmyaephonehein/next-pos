/*
  Warnings:

  - You are about to drop the column `assetUrl` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orderlines" DROP CONSTRAINT "Orderlines_addonId_fkey";

-- DropForeignKey
ALTER TABLE "Orderlines" DROP CONSTRAINT "Orderlines_menuId_fkey";

-- DropForeignKey
ALTER TABLE "Orderlines" DROP CONSTRAINT "Orderlines_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_tableId_fkey";

-- AlterTable
ALTER TABLE "Addons" ALTER COLUMN "isAvailable" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "assetUrl",
ALTER COLUMN "name" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Orderlines" ADD CONSTRAINT "Orderlines_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Orderlines" ADD CONSTRAINT "Orderlines_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Orderlines" ADD CONSTRAINT "Orderlines_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
