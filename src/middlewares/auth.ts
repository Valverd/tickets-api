import { NextFunction } from "express";
import { IncomingHttpHeaders } from "node:http";


export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.get('Authorization')
    console.log(token)
}