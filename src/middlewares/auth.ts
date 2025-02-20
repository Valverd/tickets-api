import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken'
import { UserModel } from "../models/User";

type MiddlewareHandler = (
    req: MiddlewareRequest,
    res: Response,
    next: NextFunction
) => void

interface MiddlewareRequest extends Request {
    headers: Request["headers"] & { authorization?: string }
    user: UserModel
}

export const auth: MiddlewareHandler = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(400).json({ message: "Acesso não autorizado." });
        return
    };

    try {
        await jwt.verify(token, process.env.TOKEN_SECRET)
        console.log(jwt.verify(token, process.env.TOKEN_SECRET))
        next()

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        } else {
            return res.status(500).json({ message: "Erro desconhecido", error })
        }
    }
}