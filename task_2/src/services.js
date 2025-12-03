import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// esm doesn't support _dirname , _filename, so using fileUrlToPath helps out
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const filePath = path.join(_dirname, "data", "item.json");


// to get all items
export const getAllItems = (req, res) => {
  fs.readFile(filePath, "utf8", (err, items) => {

    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end("failed to read file");
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(items);
  });
};

// to get a single item
// to get a single item
export const getOneItem = (req, res) => {
  const id = req.params.id;
  
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end("failed to read file");
    }
    
    // converting the JSON file to js object
    const items = JSON.parse(data);
    const item = items.find((i) => i.id.toString() === id.toString());
    
    if (!item) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end("item not found");
    }
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(item));
  });
};

// to create item
export const addItem = (req, res) => {
  const body = []
  req.on("end",(chunk)=>{
    body.push(chunk)
  });
  req.on("end",()=>{
    // parsedItem here is a string
    const parsedItem = Buffer.concat(body).toString()

    // to be converted to a js object for easy manipulation
    const newItem = JSON.parse(parsedItem)

    // file must be read before adding a new item
    fs.readFile(filePath,"utf8",(err,item)=>{
      if(err){
        res.writeHead(500,{"Content-Type":"application/json"})
        return res.end("error reading file")
      }
      // item is also in string and needed t be converted to jsobject
      const oldItem = JSON.parse(item);
      const allItems = [...oldItem,newItem]

      // fs only deals woth string and not array or object and allItem is an array
      fs.writeFile(filePath,JSON.stringify(allItems),(err)=>{
        if(err){
          res.writeHead(400,{"Content-Type":"application/json"})
          return res.end("Internal error, couldn't save file")
        }
        res.writeHead(200,{"Content-Type":"application/json"})
        return res.end(JSON.stringify(newItem))
      })
    })
  })

};

// to update item
export const updateItem = (req, res) => {};

// to delete item
export const deleteItem = (req, res) => {};
