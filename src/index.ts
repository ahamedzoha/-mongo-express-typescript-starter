import express from "express"
import http from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from "cors"
import mongoose from "mongoose"
import router from "./router"

const app = express()

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/"
app.use(
  cors({
    credentials: true,
  })
)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())

const server = http.createServer(app)

server.listen(8080, () => {
  console.log("Server is listening on port http://localhost:8080")
})

mongoose.Promise = Promise

mongoose.connect(MONGO_URI)
mongoose.connection.on("error", (error) => {
  throw new Error(
    `Error: ${error} - unable to connect to database: ${MONGO_URI}`
  )
})

mongoose.connection.on("connected", () => {
  console.log(`Connected to database: ${MONGO_URI}`)
})
app.use("/", router())
