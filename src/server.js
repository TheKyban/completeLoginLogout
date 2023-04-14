import express from "express";
import { PORT, DATA_BASE_URL } from "./constants/constants.js";
import route from "./routes/route.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express()

/**
 * Connection to database
 */

mongoose.connect(DATA_BASE_URL).then(()=>console.log("DATABASE CONNECTED...")).catch(()=> console.log('DATABASE NOT CONNECTED...'))


/**
 * set view engine
 */
app.set('view engine', "ejs")


/**
 * Uses
 */
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


/**
 * stich the routes to the server
 */
route(app)


/**
 * Listen server on the specific PORT
 */
app.listen(PORT, () => console.log("SERVER STARTED..."))