// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, locationIds } = req.body;
    const isValid = name && locationIds.length;
    if (!isValid) return res.status(400).send("Bad request");
    const menuCategory = await prisma.menuCategories.create({
      data: { name },
    });
    const menusMenuCategoriesLocationsData = locationIds.map(
      (locationId: number) => ({
        menuCategoryId: menuCategory.id,
        locationId: locationId,
      })
    );
    await prisma.menusMenuCategoriesLocations.createMany({
      data: menusMenuCategoriesLocationsData,
    });
    return res.status(200).send(menuCategory);
  } else if (req.method === "PUT") {
    const { id, name, locationIds } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request");
    const menuCategoryId = Number(id);
    // Let's update first the name
    const menuCategoryUpdated = await prisma.menuCategories.update({
      data: { name },
      where: { id: menuCategoryId },
    });
    if (locationIds.length) {
      // first let's get all the existing rows for the menu category we are updating
      const menusMenuCategoriesLocations =
        await prisma.menusMenuCategoriesLocations.findMany({
          where: { menuCategoryId: menuCategoryId },
        });
      // map just to get the location ids
      const existingLocationIds = menusMenuCategoriesLocations
        .map((item) => item.locationId)
        .filter((item) => item);
      // let's find out which new location ids will be connected to this menu category id
      const addedLocationIds = locationIds.filter(
        (item: number) => !existingLocationIds.includes(item)
      );
      // let's find out which old location ids will be disconnected from this menu category id
      const removedLocationIds = existingLocationIds.filter(
        (item) => !locationIds.includes(item)
      ) as number[];
      // add new rows for each new location id and the menu category id
      if (addedLocationIds.length) {
        const newMenusMenuCategoriesLocations = addedLocationIds.map(
          (item: number) => ({
            menuCategoryId: menuCategoryId,
            locationId: item,
          })
        );
        await prisma.menusMenuCategoriesLocations.createMany({
          data: newMenusMenuCategoriesLocations,
        });
      }
      if (removedLocationIds.length) {
        removedLocationIds.forEach(async (locationId) => {
          const row = await prisma.menusMenuCategoriesLocations.findFirst({
            where: {
              locationId: locationId,
              menuCategoryId: menuCategoryId,
            },
          });
          if (row) {
            if (row.menuId) {
              await prisma.menusMenuCategoriesLocations.update({
                data: { locationId: null },
                where: { id: row.id },
              });
            } else {
              await prisma.menusMenuCategoriesLocations.delete({
                where: { id: row.id },
              });
            }
          }
        });
      }
    }
    return res.status(200).send(menuCategoryUpdated);
  } else if (req.method === "DELETE") {
    const menuCategoryId = req.query.id;
    if (!menuCategoryId) return res.status(400).send("Bad request");
    await prisma.menuCategories.update({
      data: { isArchived: true },
      where: { id: Number(menuCategoryId) },
    });
    return res.send(200);
  }
  res.status(405).send("Method not allowed");
}
