import { AuthenticatedRoutesHandler } from "../types/request_types";
import { Response } from "express";
import Place from "../models/Place";
import memcached from "../../memcached";
import { promisify } from "util"
import Ticket from "../models/Ticket";
import Room from "../models/Room";
import Movie from "../models/Movie";
import Section from "../models/Section";
import Price from "../models/Price";
import Reservation from "../models/Reservation";

export const see_my_tickets: AuthenticatedRoutesHandler = async (req, res) => {
    const { user_id } = req

    try {
        const tickets = await Ticket.findAll({ where: { user_id } })
        res.json(tickets)

    } catch (error) {
        handleError(res, error)
    }
}

export const get_prices: AuthenticatedRoutesHandler<{}, { place_id: number, section_id: number }> = async (req, res) => {
    const { place_id, section_id } = req.body

    const memGet = promisify(memcached.get).bind(memcached)

    try {
        const reservation = await memGet(`place_id:${place_id}${section_id}`)
    } catch (error) {
        handleError(res, error)
    }
}

export const buy_ticket: AuthenticatedRoutesHandler<{}, { place_id: number, section_id: number, price_id: number }> = async (req, res) => {

    const { place_id, section_id, price_id } = req.body
    const { user_id } = req

    const memGet = promisify(memcached.get).bind(memcached)

    try {
        const reservation = await memGet(`place_id:${place_id}${section_id}`)
        if (!reservation) return res.status(404).json({ message: "Sua sessão já expirou." })
        if (reservation.user_id != user_id) return res.status(404).json({ message: "Usuário não autenticado." })

        const place = await Place.findByPk(reservation.place_id)
        if (!place) return res.status(404).json({ message: "Lugar não encontrado" })

        const section = await Section.findByPk(reservation.section_id, { raw: true })
        if (!section) return res.status(404).json({ message: "Sessão não encontrada" })

        const price = await Price.findByPk(price_id, { raw: true })
        if (!price) return res.status(404).json({ message: "Preço informado errado" })

        await Ticket.create({
            user_id,
            place_id,
            section_id,
            price_id
        })

        await Reservation.create({
            user_id,
            place_id,
            section_id,
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