import { NextFunction, Response } from "express";
import { IncomingHttpHeaders } from "http";
import jwt from 'jsonwebtoken'

interface MiddlewareHandler extends Omit<Request, "headers"> {
    headers: IncomingHttpHeaders & { authorization?: string }
}

export const auth = async (req: MiddlewareHandler, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({ message: "Acesso não autorizado." });
    };

    try {
        await jwt.verify(token, process.env.TOKEN_SECRET)
        return next()

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        } else {
            return console.log("Erro desconhecido:", error)
        }
    }
}