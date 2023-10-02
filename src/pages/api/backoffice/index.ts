// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, email } = req.body;
    await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return res.send(200);
  }
  res.send(405);
}
