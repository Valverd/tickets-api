import { AuthenticatedRoutesHandler } from "../types/request_types";
import { Response } from "express";
import jwt from 'jsonwebtoken'

export const buy_ticket: AuthenticatedRoutesHandler = async (req, res) => {
    try {

        const place_token = req.headers.place_token
        if (!place_token) return res.status(404).json({ message: "Token de compra negado." })

        const place_token_verified = await jwt.verify(place_token, process.env.TOKEN_SECRET)
        console.log(place_token)
        console.log(place_token_verified)
        res.send("teste")

    } catch (error) {
        handleError(res, error)
    }
}

const handleError = (res: Response, error: unknown) => {
    if (error instanceof Error) {
        return res.status(500).json({ message: error.message })
    } else {
        return res.status(500).json({ message: "Erro desconhecido", error })
    }
}