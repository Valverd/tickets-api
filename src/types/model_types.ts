import { Model } from "sequelize"

export interface UserModel extends Model {
    id: number
    name: string
    email: string
    password: string
    birth: Date
}

export interface MovieModel extends Model {
    id: number
    name: string
    tickets_number: number
    description: string
    age_group: number
}

export interface RoomModel extends Model {
    id: number
    room: number
    movie_id: number
    price_id: number
    type_room: string
}

export interface PlaceModel extends Model {
    id: number
    place: string
    room_id: number
}

export interface ReservationModel extends Model {
    id: number
    user_id: number
    place_id: number
    section_id: number
}