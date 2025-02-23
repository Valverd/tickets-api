import { AuthenticatedRoutesHandler } from "../types/request_types";
import { Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import Place from "../models/Place";

export const buy_ticket: AuthenticatedRoutesHandler<{}, { place_id: string}> = async (req, res) => {
    const { place_id } = req.body
    const place_token = req.headers.place_token

    try {
        if (!place_id) return res.status(404).json({ message: "Lugar não encontrado." })
        if (!place_token) return res.status(404).json({ message: "Token não encontrado." })

        const place_token_verified = await jwt.verify(place_token, process.env.TOKEN_SECRET)

        if (place_id != (place_token_verified as JwtPayload).place_id) return res.status(400).json({ message: "ID de token não condiz com o lugar." })

        await Place.update({ status: "occupied" }, { where: { id: place_id } })
        res.json({ message: "Ingresso comprado" })

    } catch (error) {
        handleError(res, error, place_id)
    }
}

const handleError = async (res: Response, error: unknown, place_id: string) => {
    if (error instanceof Error) {
        if (error.message == "jwt expired") await Place.update({ status: "available" }, { where: { id: place_id } })
        return res.status(500).json({ message: error.message })
    } else {
        return res.status(500).json({ message: "Erro desconhecido", error })
    }
}