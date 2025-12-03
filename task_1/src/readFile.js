import fs from "node:fs"
import { fileURLToPath } from "node:url";
import path from "node:path";

// ESM doesnt provide _filename, _dirname so using the fileURLToPath assist to solve the issue
const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
const filePath = path.join(_dirname,"index.html")

// read the index_html file
export const readIndexFile = (req,res)=>{
    fs.readFile(filePath,"utf8",(err,data)=>{
        if(err){
            return res.end("an error occured")
        }
        res.end(data)
    })    

}
