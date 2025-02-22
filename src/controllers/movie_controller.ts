import { Response } from "express"
import jwt from 'jsonwebtoken'
import Movie from "../models/Movie"
import Room from "../models/Room"
import Place from "../models/Place"
import { AuthenticatedRoutesHandler } from "../types/request_types"

export const get_movies: AuthenticatedRoutesHandler = async (req, res) => {
    try {
        const movies = await Movie.findAll()
        res.json(movies)
    } catch (error) {
        handleError(res, error)
    }
}

export const get_rooms_movies: AuthenticatedRoutesHandler = async (req, res) => {
    try {
        const movies_rooms = await Room.findAll({ include: Movie })
        res.json(movies_rooms)

    } catch (error) {
        handleError(res, error)
    }
}

export const get_places_by_rooms: AuthenticatedRoutesHandler<{ room_id: string }> = async (req, res) => {
    try {
        const { room_id } = req.params
        const places = await Place.findAll({ where: { room_id } })
        res.json(places)

    } catch (error) {
        handleError(res, error)
    }
}

export const choose_place: AuthenticatedRoutesHandler<{}, { place_id: string }> = async (req, res) => {
    try {
        const { place_id } = req.body
        const { user_id } = req

        const place = await Place.findByPk(place_id)

        if (!place) return res.status(404).json({ message: "Lugar não encontrado" })
        if (place.status == "occupied" || place.status == "reserved") return res.status(400).json({ message: "Lugar ja está reservado." })

        await Place.update({ status: 'reserved' }, { where: { id: place_id } })
        const place_token = await jwt.sign({ user_id, place_id }, process.env.TOKEN_SECRET, { expiresIn: '60s' })
        
        res.json({ message: "Lugar reservado, você tem 1 minuto para finalizar a seção", place_token})
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