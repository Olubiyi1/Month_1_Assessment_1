import dotenv from "dotenv"
import process from "node:process"
dotenv.config()

export default{
    port : process.env.PORT,
    hostname : process.env.HOSTNAME
}