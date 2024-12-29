import { NextFunction } from "express"

export const Check=(req: Request, res: Response, next: NextFunction)=>{
    console.log("check route not hit")
    next()
}