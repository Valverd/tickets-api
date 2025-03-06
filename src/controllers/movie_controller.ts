import { Response } from "express"
import Movie from "../models/Movie"
import Room from "../models/Room"
import Place from "../models/Place"
import { AuthenticatedRoutesHandler } from "../types/request_types"
import memcached from "../../memcached"
import { promisify } from "util"

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

    const memGet = promisify(memcached.get).bind(memcached)
    const memSet = promisify(memcached.set).bind(memcached)

    try {
        const { place_id } = req.body
        const { user_id } = req

        const reservation = await memGet(`place_id:${place_id}`)
        if (reservation) return res.status(400).json({ message: "Outra pessoa já está reservando esse lugar." })

        const place = await Place.findByPk(place_id)
        if (place?.status == "occupied") return res.status(400).json({ message: "Lucar já está ocupado." })

        await memSet(`place_id:${place_id}`, user_id, 60)

        res.json({ message: "Lugar reservado! Você tem 1 minuto para finalizar a seção." })

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