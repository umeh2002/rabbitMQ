import cors from "cors"
import express, { Application,Request, Response } from "express"
import auth from "./Router/authRouter"
import ejs from "ejs"

export const mainApp =(app:Application)=>{
app.use(express.json())
app.use(cors())

app.set("view engine", "ejs")

app.get("/",(req:Request,res:Response)=>{
    try {
        return res.status(200).json({
            message:"welcome"
        })
    } catch (error:any) {
        return res.status(404).json({
            message: "error",
            data:error.message
          });
    }
  })

app.use("/api", auth)
}