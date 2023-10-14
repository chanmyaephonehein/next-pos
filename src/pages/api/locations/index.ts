// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const companyId = req.query.companyId;
    const isValid = companyId;
    if (!isValid) return res.status(400).send("Bad request");
    const locations = await prisma.locations.findMany({
      where: { companyId: Number(companyId) },
    });
    return res.status(200).send(locations);
  } else if (req.method === "POST") {
    const data = req.body;
    const { name, address, companyId } = data;
    const isValid = name && address;
    if (!isValid) return res.status(400).send("Bad request");
    const locationCreated = await prisma.locations.create({
      data: { name, address, companyId: companyId },
    });
    return res.status(200).send(locationCreated);
  } else if (req.method === "PUT") {
    const { id, name, address } = req.body;
    const isValid = id && name && address;
    if (!isValid) return res.status(400).send("Bad request");
    const locationUpdated = await prisma.locations.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        address,
      },
    });
    return res.status(200).send(locationUpdated);
  } else if (req.method === "DELETE") {
    const locationId = req.query.id;
    if (!locationId) return res.status(400).send("Bad request");
    await prisma.locations.update({
      data: { isArchived: true },
      where: { id: Number(locationId) },
    });
    return res.send(200);
  }
  res.status(405).send("Method not allowed");
}
