import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "method not allowed" });
  }
  const s3 = new S3({
    region: "us-west-1",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    signatureVersion: "v4",
  });
  try {
    let { name, type } = req.body;
    const fileParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: name,
      ContentType: type,
      Expires: 600, // seconds
    };
    const url = await s3.getSignedUrlPromise("putObject", fileParams);

    res.status(200).json({ url });
  } catch (e) {
    res.status(400).send(e);
  }
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb", // Set desired value here
    },
  },
};
