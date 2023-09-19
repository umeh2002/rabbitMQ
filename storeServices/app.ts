import cors from "cors"
import express, { Application,Request, Response } from "express"
import store from "./router/storeRouter"


export const mainApp =(app:Application)=>{
    app.use(express.json())
    app.use(cors())

    app.get("/",(req:Request, res:Response)=>{
        try {
            return res.status(200).json({
                message:"welcome to my store api"
            })
        } catch (error:any) {
            console.log(error)
        }
    })

    app.use("/api", store)
}