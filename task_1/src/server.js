import http from "node:http"
import config from "./config.js";
import { HandleRequest } from "./route.js";
// creating the server
const Server = http.createServer(HandleRequest)

Server.listen(config.port,config.hostname,()=>{
    console.log(`server started on ${config.hostname}:${config.port}`);
    
})

