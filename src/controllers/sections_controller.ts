import { Response } from "express"
import { db } from "../db/db"
import { AuthenticatedRoutesHandler } from "../types/request_types"
import Section from "../models/Section"
import Sequelize from "sequelize"
import Place from "../models/Place"
import Reservation from "../models/Reservation"
import memcached from "../../memcached"
import { promisify } from "util"
import { PlaceModel, ReservationModel } from "../types/model_types"

export const get_sections: AuthenticatedRoutesHandler = async (req, res) => {
    try {

        const sections = await Section.findAll()
        res.json({ message: sections })

    } catch (error) {
        handleError(res, error)
    }
}

export const get_sections_by_date_and_movie: AuthenticatedRoutesHandler<{}, {}, { day: Date, movie_id: number }> = async (req, res) => {

    const { day, movie_id } = req.query

    try {

        const sections = await db.query(`
            SELECT sc.id, m.name, sc.schedule, r.room
            FROM Sections sc
            JOIN Rooms r on r.id = sc.room_id
            JOIN Movies m on m.id = sc.movie_id
            WHERE sc.movie_id = :movie_id
            AND sc.day = :day
            `, {
            replacements: { movie_id, day },
            type: Sequelize.QueryTypes.SELECT
        })

        res.json({ message: sections })

    } catch (error) {
        handleError(res, error)
    }
}


export const get_places_by_section: AuthenticatedRoutesHandler<{}, { room_id: number, section_id: number }> = async (req, res) => {
    const { room_id, section_id } = req.body
    const memGet = promisify(memcached.get).bind(memcached)

    try {
        const all_places: PlaceModel[] = await db.query(`
                SELECT p.id, p.place, p.room_id FROM Places p
                JOIN Sections sc on sc.room_id = p.room_id
                WHERE sc.id = :section_id
            `, {
            replacements: { section_id },
            type: Sequelize.QueryTypes.SELECT
        }
        )
        const places_occupied: ReservationModel[] = await Reservation.findAll({ where: { section_id } })
        
        let places_with_reserved = await Promise.all(
            all_places.map(async (place) => {
                let data = await memGet(`place_id:${place.id}${section_id}`)
                if (data) return data.place_id
            })
        )
        let places_reserved = places_with_reserved.filter(place => place != undefined)

        let places = all_places.map((place) => {
            let status = "available"
            let place_is_occupied = places_occupied.find(occupied => place.id == occupied.place_id)
            let place_is_reserved = places_reserved.find(reserved => place.id == reserved)

            if (place_is_occupied) status = "occupied"
            if (place_is_reserved) status = "occupied"

            return {
                id: place.id,
                place: place.place,
                status
            }
        })

        res.json({ places })

    } catch (error) {
        handleError(res, error)
    }
}

export const choose_place: AuthenticatedRoutesHandler<{}, { section_id: string, place_id: string }> = async (req, res) => {

    const { user_id } = req
    const { section_id, place_id } = req.body
    const memGet = promisify(memcached.get).bind(memcached)
    const memSet = promisify(memcached.set).bind(memcached)

    try {

        const place_is_reserved = await memGet(`place_id:${place_id}${section_id}`)
        if (place_is_reserved) return res.status(400).json({ message: "Outra pessoa já está reservando esse lugar." })

        const place_is_occupied = await Reservation.findAll({ where: { section_id, place_id } })
        console.log(place_is_occupied)
        if (place_is_occupied.length !== 0) return res.status(400).json({ message: "Lucar já está ocupado." })

        await memSet(`place_id:${place_id}${section_id}`, { user_id, place_id, section_id }, 60)

        res.json({ message: "Lugar reservado! Você tem 1 minuto para finalizar a seção." })

    } catch (error) {
        handleError(res, error)
    }
}



export const create_sections: AuthenticatedRoutesHandler<{}, { movie_id: number, room_id: number, start: string, end: string }> = async (req, res) => {
    const { movie_id, room_id, start, end } = req.body

    try {

        const today = new Date();
        let dates = []

        for (let i = 0; i < 3; i++) {

            let day_of_section = today.getDate() + i
            let date_of_section = `${today.getFullYear()}/${(today.getMonth() + 1).toString().length > 1 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)}/${day_of_section}`

            const sections = await Section.findAll({ where: { day: date_of_section } })

            if (sections.length === 0) {
                dates.push(date_of_section)

                await db.query('CALL CreateSections(:movie_id, :room_id, :date_of_section, :start, :end, 30)', {
                    replacements: {
                        movie_id,
                        room_id,
                        date_of_section,
                        start,
                        end
                    }
                })
            }

        }
        const message = dates.length > 0 ? `Sessões criadas com sucesso para os dias: ${dates.join(", ")}` : "Nenhuma sessão foi criada, pois já existem para os próximos 3 dias."

        res.json({ message })

    } catch (error) {
        handleError(res, error)
    }

}

const handleError = (res: Response, error: unknown) => {
    if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
    } else {
        return res.status(500).json({ message: "Erro desconhecido", error })
    }
}