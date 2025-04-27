import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import prisma from "../db/prisma.js";

interface DecodedToken extends JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                fullName: string;
                username: string;
                profilePic: string;
            };
        }
    }
}

const protectRoute = async (req:Request, res:Response, next:NextFunction) =>{

    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        if(!decoded){
            return res.status(401).json({message: "Unauthorized"})
        }
        const user = await prisma.user.findUnique({ where : { id: decoded.userId }, select: { id: true, fullName: true, username: true, profilePic: true } })   ;
        if(!user){
            return res.status(401).json({message: "Unauthorized"})
        }
        req.user = user;

        next()
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    } 
}

export default protectRoute;