import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from ".";
import { verify } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"] ?? "";

    try {
        const decoded = verify(authHeader, JWT_SECRET);
        console.log(decoded);
        // @ts-ignore
        if (decoded.userId) {
            // @ts-ignore
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            })    
        }
    } catch(err) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
}