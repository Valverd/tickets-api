import { Response, Request } from "express"
import bcrypt from 'bcrypt'
import User from "../models/User"
import jwt from 'jsonwebtoken'


type RouteHandler<TParams = {}, TBody = {}, TQuery = {}> = ( // Generics para receberem valores vazios caso não use no req (Request)
    req: Request<TParams, {}, TBody, TQuery>,
    res: Response
) => Promise<Response | void>

interface UserRequestBody {
    name: string,
    email: string,
    password: string,
    birth: Date
}

export const get_user: RouteHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findByPk(id)
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' })

        res.json(user)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
        } else {
            console.log("Erro desconhecido: ", error)
            return res.status(500).json({ message: "Erro desconhecido", error })
        }
    }
}

export const create_user: RouteHandler<{}, UserRequestBody> = async (req, res) => {
    try {
        const { name, email, password, birth } = req.body

        const user_exists = await User.findOne({ where: { email } })

        if (user_exists) return res.status(400).json({ message: 'Usuário já existe.' })

        const user = {
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            birth
        }

        await User.create(user)
        res.json({ message: 'Usuário Criado.' })

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
        } else {
            console.log("Erro desconhecido: ", error)
            return res.status(500).json({ message: "Erro desconhecido", error })
        }
    }
}

export const alter_user: RouteHandler<{ id: string }, UserRequestBody> = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, password, birth } = req.body
        const user = {
            name,
            email,
            password,
            birth,
        }

        const user_exists = await User.findByPk(id)

        if (!user_exists) return res.status(404).json({ message: 'Usuário não encontrado.' })

        await User.update(user, { where: { id } })
        res.json({ message: 'Usuário alterado com sucesso.' })
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
        } else {
            console.log("Erro desconhecido: ", error)
            return res.status(500).json({ message: "Erro desconhecido", error })
        }
    }
}

export const delete_user: RouteHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params

        const user_exists = await User.findByPk(id)

        if (!user_exists) return res.status(404).json({ message: 'Usuário não encontrado.' })

        await User.destroy({ where: { id } })
        res.json({ message: 'Usuário deletado.' })
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
        } else {
            console.log("Erro desconhecido: ", error)
            return res.status(500).json({ message: "Erro desconhecido", error })
        }
    }
}

export const login: RouteHandler<{}, UserRequestBody> = async (req, res) => {
    const { email, password } = req.body

    const selected_user = await User.findOne({ where: { email } })
    if (!selected_user) return res.status(404).json({ message: "Usuário ou senha estão incorretos." })

    const email_password_match = bcrypt.compareSync(password, selected_user.password)
    if (!email_password_match) return res.status(404).json({ message: "Usuário ou senha estão incorretos." })

    try {
        const token = jwt.sign({ id: selected_user.id }, process.env.TOKEN_SECRET, { expiresIn: '24h' })
        res.json({ message: "Login efetuado com sucesso.", token: token })

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
        } else {
            console.log("Erro desconhecido: ", error)
            return res.status(500).json({ message: "Erro desconhecido", error })
        }
    }
}