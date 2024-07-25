import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
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
    const command = new PutObjectCommand({
        Bucket: "s3datalabelingblockchain",
        Key: `/s3datalabelingblockchain-folder/${userId}/${Math.random()}/image.jpg`,
        ContentType: "img/jpg"
    })
    const preSignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600
    })
    console.log(preSignedUrl)
    res.send(preSignedUrl)
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