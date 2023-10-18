// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, isRequired, menuIds } = req.body;
    const isValid = name && menuIds.length; // validation
    if (!isValid) return res.status(400).send("Bad request");
    const addonCategory = await prisma.addonCategories.create({
      data: {
        name,
        isRequired: isRequired === undefined ? false : isRequired,
      },
    });
    const menusAddonCategories = menuIds.map((menuId: number) => ({
      menuId: menuId,
      addonCategoryId: addonCategory.id,
    }));
    await prisma.menusAddonCategories.createMany({
      data: menusAddonCategories,
    });
    return res.status(200).send(addonCategory);
  } else if (req.method === "PUT") {
    const { id, name, isRequired } = req.body;
    const addonCategoryUpdated = await prisma.addonCategories.update({
      data: { name, isRequired },
      where: { id },
    });
    return res.status(200).send(addonCategoryUpdated);
  } else if (req.method === "DELETE") {
    const addonCategoryId = req.query.id;
    const isValid = addonCategoryId;
    if (!isValid) return res.status(400).send("Bad request");
    await prisma.addonCategories.update({
      data: { isArchived: true },
      where: { id: Number(addonCategoryId) },
    });
    return res.status(200).send("OK");
  }
  res.status(405).send("Method not allowed");
}
