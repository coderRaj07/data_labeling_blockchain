import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'
import { Router } from "express"
const router = Router();

const prismaClient = new PrismaClient()
const JWT_SECRET = "Raj1234"

// signin with wallet
// signin a message
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