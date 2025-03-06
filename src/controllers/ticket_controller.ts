import { AuthenticatedRoutesHandler } from "../types/request_types";
import { Response } from "express";
import Place from "../models/Place";
import memcached from "../../memcached";
import { promisify } from "util"
import Ticket from "../models/Ticket";
import Room from "../models/Room";
import Movie from "../models/Movie";

export const see_my_tickets: AuthenticatedRoutesHandler = async (req, res) => {
    const { user_id } = req

    try {
        const tickets = await Ticket.findAll({ where: { user_id } })
        res.json(tickets)

    } catch (error) {
        handleError(res, error)
    }
}

export const buy_ticket: AuthenticatedRoutesHandler<{}, { place_id: number, price_id: number }> = async (req, res) => {
    const { place_id } = req.body
    const { user_id } = req

    const memGet = promisify(memcached.get).bind(memcached)

    try {
        const reservation = await memGet(`place_id:${place_id}`)

        if (!reservation) return res.status(404).json({ message: "Sua sessão já expirou." })
        if (reservation != user_id) return res.status(404).json({ message: "Usuário não autenticado." })

        const place = await Place.findByPk(place_id)
        const room = await Room.findByPk(place?.room_id)
        const movie = await Movie.findByPk(room?.movie_id)

        await Place.update({ status: "occupied" }, { where: { id: place_id } })

        Ticket.create({
            name: movie?.name,
            price: 9.99,
            user_id,
            movie_id: movie?.id,
            place_id,
            room_id: room?.id
        })

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