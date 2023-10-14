import { prisma } from "@/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "PUT") {
    const { id, name, address } = req.body;
    const isValid = id && name && address;
    if (!isValid) return res.status(400).send("Bad request");
    await prisma.companies.update({ data: { name, address }, where: { id } });
    return res.send(200);
  }
  res.status(405).send("Method not allowed");
}
