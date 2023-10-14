import { config } from "@/config";
import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import QRCode from "qrcode";

export const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB

export const generateLinkForQRCode = (locationId: number, tableId: number) => {
  return `${config.orderAppUrl}?locationId=${locationId}&tableId=${tableId}`;
};

export const qrCodeImageUpload = async (
  locationId: number,
  tableId: number
) => {
  try {
    const qrImageData = await QRCode.toDataURL(
      generateLinkForQRCode(locationId, tableId)
    );
    const input = {
      Bucket: "msquarefdc",
      Key: `foodie-pos/qrcode/msquare/locationId-${locationId}-tableId-${tableId}.png`,
      ACL: "public-read",
      Body: Buffer.from(
        qrImageData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
    };
    const command = new PutObjectCommand(input);
    await s3Client.send(command);
  } catch (err) {
    console.error(err);
  }
};

// Set S3 endpoint to DigitalOcean Spaces
const s3Client = new S3Client({
  endpoint: config.spaceEndpoint,
  region: "sgp1",
  credentials: {
    accessKeyId: config.spaceAccessKeyId,
    secretAccessKey: config.spaceSecretAccessKey,
  },
});

export const fileUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "msquarefdc",
    acl: "public-read",
    key: function (request: any, file: any, cb: any) {
      cb(null, `happy-pos/msquare/${Date.now()}_${file.originalname}`);
    },
  }),
}).array("files", 1);
