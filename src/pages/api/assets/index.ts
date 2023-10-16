// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fileUpload } from "@/utils/server";
import { Request, Response } from "express";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

type CustomNextApiRequest = NextApiRequest &
  Request & {
    files: any[];
  };

type CustomNextApiResponse = NextApiResponse & Response;

export default async function handler(
  req: CustomNextApiRequest,
  res: CustomNextApiResponse
) {
  try {
    fileUpload(req, res, async (error) => {
      if (error) {
        return res.status(500).send("Internal Server Error");
      }
      const files = req.files as Express.MulterS3.File[];
      const file = files[0];
      const assetUrl = file.location;
      res.send({ assetUrl });
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
}
