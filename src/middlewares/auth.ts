import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { MiddlewareAuthHandler } from "../types/middleware_types";


export const auth: MiddlewareAuthHandler = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(400).json({ message: "Acesso não autorizado." })

    try {
        const user_id = await jwt.verify(token, process.env.TOKEN_SECRET)
        req.user_id = (user_id as JwtPayload).id
        next()

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        } else {
            return res.status(500).json({ message: "Erro desconhecido", error })
        }
    }
}