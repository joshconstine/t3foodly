import S3 from 'aws-sdk/clients/s3'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const s3 = new S3({
        region: 'us-west-1',
        apiVersion: '2022-11-20',
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    })
    try {

        const post = await s3.createPresignedPost({
            Bucket: process.env.BUCKET_NAME,

            Fields: {
                key: req.query.file,
                'Content-Type': req.query.fileType,
            },
            Expires: 60, // seconds
            Conditions: [
                ['content-length-range', 0, 1048576], // up to 1 MB
            ],
        })
        res.status(200).json(post)
    } catch (e) {
        console.log(console.error(e));
        res.status(400).send(e)

    }

}