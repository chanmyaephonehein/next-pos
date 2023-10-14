import { prisma } from "@/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, price, addonCategoryId } = req.body;
    const isValid = name && addonCategoryId;
    if (!isValid) return res.status(400).send("Bad request");
    const addonCreated = await prisma.addons.create({
      data: { name, price, addonCategoryId: addonCategoryId },
    });
    return res.status(200).send(addonCreated);
  } else if (req.method === "PUT") {
    const { id, name, price } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request");
    const addonUpdated = await prisma.addons.update({
      data: {
        name,
        price,
      },
      where: { id: Number(id) },
    });
    return res.status(200).send(addonUpdated);
  } else if (req.method === "DELETE") {
    const addonId = req.query.id;
    if (!addonId) return res.status(400).send("Bad request");
    await prisma.addons.update({
      data: { isArchived: true },
      where: { id: Number(addonId) },
    });
    return res.status(200).send("OK");
  }
  res.status(405).send("Method not allowed");
}
