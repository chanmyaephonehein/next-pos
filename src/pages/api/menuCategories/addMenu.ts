import { prisma } from "@/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "PUT") {
    const { menuCategoryId, menuId, locationId } = req.body;
    const isValid = menuCategoryId && menuId && locationId;
    if (!isValid) return res.status(400).send("Bad request");
    await prisma.menusMenuCategoriesLocations.create({
      data: {
        menuId: menuId,
        menuCategoryId: Number(menuCategoryId),
        locationId: Number(locationId),
      },
    });
    return res.send(200);
  }
  res.status(405).send("Method not allowed");
}
