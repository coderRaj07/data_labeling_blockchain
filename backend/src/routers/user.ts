import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Router } from "express"
import { JWT_SECRET } from ".."
import { authMiddleware } from "../middleware"

const router = Router();
const prismaClient = new PrismaClient()

const s3Client = new S3Client({
    credentials: {
        "accessKeyId": "",
        "secretAccessKey": ""
    }
})

router.get("/presignedUrl", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: "s3datalabelingblockchain",
        Key: `s3datalabelingblockchain-folder/${userId}/${Math.random()}/image.jpg`,
        Conditions: [
          ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
        ],
        Fields: {
          success_action_status: '201',
          'Content-Type': 'image/png'
        },
        Expires: 3600
      })
    console.log({preSignedUrl: url, fields })
    res.send({preSignedUrl: url, fields })
})

router.post("/signin", async (req, res) => {
    // Todo: Add sign verification logic
    const hardcodedWalletAddress = "7HWRvSLs9zz3zUp1DrrgG9vjN3J1vxzqGoEK2xL6AKDD"
    let user = await prismaClient.user.findFirst({
        where: {
            address: hardcodedWalletAddress
        }
    })

    if (!user) {
        user = await prismaClient.user.create({
            data: {
                address: hardcodedWalletAddress
            }
        })
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({ token })
})

export default router;