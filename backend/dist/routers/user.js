"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
const JWT_SECRET = "Raj1234";
// signin with wallet
// signin a message
router.post("/signin", async (req, res) => {
    // Todo: Add sign verification logic
    const hardcodedWalletAddress = "7HWRvSLs9zz3zUp1DrrgG9vjN3J1vxzqGoEK2xL6AKDD";
    let user = await prismaClient.user.findFirst({
        where: {
            address: hardcodedWalletAddress
        }
    });
    if (!user) {
        user = await prismaClient.user.create({
            data: {
                address: hardcodedWalletAddress
            }
        });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id
    }, JWT_SECRET);
    res.json({ token });
});
exports.default = router;
