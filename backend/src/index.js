// require('dotenv').config({path: './env'})

// import dotenv from "dotenv"

// dotenv.config({
//     path:'./.env'
// })
// import connectDB from "./db/index.js"
// import { app } from "./app.js"


// connectDB()
// .then(()=>{
//     app.on("error", (error)=>{
//         console.log("ERROR: ", error);
//         throw error
//     })
//     app.listen(process.env.PORT || 8000, ()=>{
//         console.log(`Server is running at port : ${process.env.PORT}`);
//     })
// })
// .catch((err)=>{
//     console.log("MogoDB db connection failed !!  ",err)
// })


import "dotenv/config"
import connectDB from "./db/index.js"
import { app } from "./app.js"

const PORT = process.env.PORT || 8000

connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT}`)
        })

        server.on("error", (error) => {
            console.log("ERROR: ", error)
            throw error
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !! ", err)
    })




























// import express from "express"
// const app = express()
// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//         app.on("error",(error)=>{
//             console.log("Error: ",error);
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${ process.env.PORT}`);
//         })

//     } catch (error) {
//         console.error("Error:" , error)
//         throw err
//     }
// })()