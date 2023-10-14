// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      name,
      price,
      locationIds,
      menuCategoryIds,
      assetUrl = "",
      description = "",
    } = req.body;
    const isValid =
      name && price && locationIds.length && menuCategoryIds.length;
    if (!isValid) return res.status(400).send("Bad request");
    const menu = await prisma.menus.create({
      data: {
        name: name,
        price: price,
        assetUrl,
      },
    });
    const menuId = menu.id;
    if (menuCategoryIds.length > 1) {
      const data = menuCategoryIds.map((menuCategoryId: number) => ({
        menuId: menuId,
        locationId: locationIds[0],
        menuCategoryId,
      }));
      await prisma.menusMenuCategoriesLocations.createMany({
        data,
      });
    } else {
      await prisma.menusMenuCategoriesLocations.create({
        data: {
          menuId: menuId,
          locationId: locationIds[0],
          menuCategoryId: menuCategoryIds[0],
        },
      });
    }
    return res.status(200).send(menu);
  } else if (req.method === "PUT") {
    const { id, name, price, addonCategoryIds } = req.body;
    const menuUpdated = await prisma.menus.update({
      data: {
        name,
        price,
      },
      where: {
        id,
      },
    });
    if (addonCategoryIds.length) {
      const menusAddonCategories = await prisma.menusAddonCategories.findMany({
        where: { menuId: id },
      });
      const existingAddonCategoryIds = menusAddonCategories.map(
        (item) => item.addonCategoryId
      ) as number[];
      const addedAddonCategoryIds = addonCategoryIds.filter(
        (item: number) => !existingAddonCategoryIds.includes(item)
      );
      const removedAddonCategoryIds = existingAddonCategoryIds.filter(
        (item: number) => !addonCategoryIds.includes(item)
      );
      if (removedAddonCategoryIds.length) {
        await prisma.menusAddonCategories.deleteMany({
          where: {
            menuId: id,
            addonCategoryId: { in: removedAddonCategoryIds },
          },
        });
      }
      if (addedAddonCategoryIds.length) {
        const newMenusAddonCategories = addedAddonCategoryIds.map(
          (item: number) => ({ menuId: id, addonCategoryId: item })
        );
        await prisma.menusAddonCategories.createMany({
          data: newMenusAddonCategories,
        });
      }
    }
    return res.status(200).send(menuUpdated);
  } else if (req.method === "DELETE") {
    const menuId = req.query.id;
    if (!menuId) return res.status(400).send("Bad request");
    await prisma.menus.update({
      data: { isArchived: true },
      where: { id: Number(menuId) },
    });
    return res.send(200);
  }
  res.status(405).send("Method not allowed");
}
