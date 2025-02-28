import { AuthenticatedRoutesHandler } from "../types/request_types";
import { Response } from "express";
import Place from "../models/Place";
import memcached from "../../memcached";
import { promisify } from "util"

export const buy_ticket: AuthenticatedRoutesHandler<{}, { place_id: number }> = async (req, res) => {
    const { place_id } = req.body
    const { user_id } = req

    const memGet = promisify(memcached.get).bind(memcached)
    const memSet = promisify(memcached.set).bind(memcached)
    
    try {
        // const reservation = memGet(`place_id:${place_id}`)
        // reservation.then(data => console.log(data)).catch(data => console.log("catch: ", data))

        res.json({ message: "Ingresso comprado" })

    } catch (error) {
        handleError(res, error)
    }
}

const handleError = async (res: Response, error: unknown) => {
    if (error instanceof Error) {
        return res.status(500).json({ message: error.message })
    } else {
        return res.status(500).json({ message: "Erro desconhecido", error })
    }
}