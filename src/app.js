import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()



// middleware to parse json
app.use(express.json())


// middleware to parse form data

app.use(express.urlencoded({ extended: true }))


// cors
app.use(cors({
    // origin: "http://localhost:3000",
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
// middleware to parse cookies


app.use(cookieParser())

// import routes
import userRouter from './routes/user.route.js'

app.use('/api/v1/users',userRouter)


export {app};