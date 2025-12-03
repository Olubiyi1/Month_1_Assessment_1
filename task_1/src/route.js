import { readIndexFile } from "./readFile.js"


export const HandleRequest = (req,res)=>{
    // converting the url path to lowercase should in case the user types in uppercase
    const route = req.url.toLowerCase()

    if(route === "/" && req.method === "GET"){
        res.writeHead(200,{"Content-Type":"text/html"})
        res.end("Welcome to my School Portal")
        return;
    }
    else if(route === "/index.html" && req.method === "GET"){
        res.writeHead(200,{"Content-Type":"text/html"})
        readIndexFile(req,res)
        return;
    }
    
    res.writeHead(404,{"Content-Type":"text/html"});
    res.end("invalid route")
}