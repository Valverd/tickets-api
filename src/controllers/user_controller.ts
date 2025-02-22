import { Response, Request } from "express"
import bcrypt from 'bcrypt'
import User from "../models/User"
import jwt from 'jsonwebtoken'
import { UserModel } from "../types/model_types"
import { AuthenticatedRoutesHandler } from "../types/request_types"


export const get_user: AuthenticatedRoutesHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req)
        const user = await User.findByPk(id)
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' })

        res.json(user)
    } catch (error) {
        handleError(res, error)
    }
}

export const create_user: AuthenticatedRoutesHandler<{}, UserModel> = async (req, res) => {
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
        return

    } catch (error) {
        handleError(res, error)
    }
}

export const alter_user: AuthenticatedRoutesHandler<{ id: string }, UserModel> = async (req, res) => {
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
        handleError(res, error)
    }
}

export const delete_user: AuthenticatedRoutesHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params

        const user_exists = await User.findByPk(id)

        if (!user_exists) return res.status(404).json({ message: 'Usuário não encontrado.' })

        await User.destroy({ where: { id } })
        res.json({ message: 'Usuário deletado.' })
    } catch (error) {
        handleError(res, error)
    }
}

export const login: AuthenticatedRoutesHandler<{}, UserModel> = async (req, res) => {
    try {
        const { email, password } = req.body

        const selected_user = await User.findOne({ where: { email } })
        if (!selected_user) return res.status(404).json({ message: "Usuário ou senha estão incorretos." })

        const email_password_match = bcrypt.compareSync(password, selected_user.password)
        if (!email_password_match) return res.status(404).json({ message: "Usuário ou senha estão incorretos." })

        const token = jwt.sign({ id: selected_user.id }, process.env.TOKEN_SECRET, { expiresIn: '24h' })
        res.json({ message: "Login efetuado com sucesso.", token: token })

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