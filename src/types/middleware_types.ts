import { Request, Response, NextFunction } from "express"

export type MiddlewareAuthHandler = (
    req: MiddlewareRequest,
    res: Response,
    next: NextFunction
) => void

export interface MiddlewareRequest extends Request {
    headers: Request["headers"] & { authorization?: string }
    user_id: string
}
