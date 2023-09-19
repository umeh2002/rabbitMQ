import express, { Application } from "express";
import { mainApp } from "./app";

const port :number = 3395
const app:Application = express()

mainApp(app)


const server = app.listen(port,()=>{
    console.log("")
    console.log("server is listening on", port)
})


process.on("uncaughtException",(reason:any)=>{
    console.log("server is shutting down due to caught exception")
    console.log(reason)
})

process.on("unhandledRejection",(error:any)=>{
    console.log("server is shutting down due to unhandled rejection")
    console.log(error)
    server.close(()=>{
        process.exit(1)
    })
})