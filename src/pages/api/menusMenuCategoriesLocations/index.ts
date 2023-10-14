// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const locationId = Number(req.query.locationId);
    const isValid = locationId;
    if (!isValid) return res.status(400).send("Bad request");
    const menusMenuCategoriesLocations =
      await prisma.menusMenuCategoriesLocations.findMany({
        where: {
          locationId: locationId,
          isArchived: false,
        },
      });
    return res.status(200).send(menusMenuCategoriesLocations);
  }
  res.status(405).send("Method not allowed");
}
