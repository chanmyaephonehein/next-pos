import { getQrCodeUrl } from "@/utils/client";
import { prisma, qrCodeImageUpload } from "@/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, locationId } = req.body;
    const isValid = name && locationId;
    if (!isValid) return res.status(400).send("Bad request");
    const table = await prisma.tables.create({
      data: { name, locationId: Number(locationId) },
    });
    await qrCodeImageUpload(locationId, table.id);
    const qrCodeUrl = getQrCodeUrl(Number(locationId), table.id);
    await prisma.tables.update({
      data: { assetUrl: qrCodeUrl },
      where: { id: table.id },
    });
    return res.status(200).send(table);
  } else if (method === "PUT") {
    const { tableId, name } = req.body;
    const isValid = tableId && name;
    if (!isValid) return res.status(400).send("Bad request");
    const tableUpdated = await prisma.tables.update({
      data: { name },
      where: { id: Number(tableId) },
    });
    return res.status(200).send(tableUpdated);
  } else if (req.method === "DELETE") {
    const tableId = req.query.id;
    if (!tableId) return res.status(400).send("Bad request");
    await prisma.tables.update({
      data: { isArchived: true },
      where: { id: Number(tableId) },
    });
    return res.send(200);
  }
  res.status(405).send("Method not allowed");
}
