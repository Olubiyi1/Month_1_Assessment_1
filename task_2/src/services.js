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
export const getOneItem = (req, res) => {

  const parts = req.url.split("/");  
  const id = parts[2];  

  fs.readFile(filePath, "utf8", (err, items) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end("failed to read file");
    }

    const itemsObj = JSON.parse(items);

    const foundItem = itemsObj.find(
      (item) => Number(item.id) === Number(id)
    );

    if (!foundItem) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end("Item with the specified id doesn't exist");
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(foundItem));
  });
};

// to create an item
export const addItem = (req, res) => {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end", () => {
    const parsedItem = Buffer.concat(body).toString();
    const newItem = JSON.parse(parsedItem);

    // adding new item to the end of the items array
    fs.readFile(filePath, "utf8", (err, data) => {

      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end("failed to read file");
      }

      const oldItems = JSON.parse(data);
      const allItems = [...oldItems, newItem];

      // writing the new item
      fs.writeFile(filePath, JSON.stringify(allItems), (err) => {

        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end("failed to add new item");
        }

        res.writeHead(200,{"Content-Type":"application/json"})
        res.end(JSON.stringify(newItem));
      });
    });
  });
};

// to update an item
export const updateItem = (req, res) => {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedItem = Buffer.concat(body).toString();
    const itemToUpdate = JSON.parse(parsedItem);
    const itemId = itemToUpdate.id

    fs.readFile(filePath, "utf8", (err, items) => {

      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end("failed to read file");
      }

      const itemsObj = JSON.parse(items)
      const itemIndex = itemsObj.findIndex((item) => {return Number(item.id) === Number(itemId)})
   
      if(itemIndex === -1){
        res.writeHead(404,{"Content-Type": "application/json"})
        return res.end("Item with the specified id doesn't exist")
      }
      
      const updatedItem = {...itemsObj[itemIndex],...itemToUpdate}
      itemsObj[itemIndex] = updatedItem 
      // console.log(updatedItem);

       fs.writeFile(filePath, JSON.stringify(itemsObj), (err) => {

        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end("failed to update item");
        }

        res.writeHead(200,{"Content-Type":"application/json"})
        res.end("Update Successful");
      })
       
      
    });
  });
};

// to delete an item
export const deleteItem = (req, res) => {
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedItem = Buffer.concat(body).toString();
    const itemToDelete = JSON.parse(parsedItem);
    const itemId = itemToDelete.id;

    fs.readFile(filePath, "utf8", (err, items) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end("failed to read file");
      }

      const itemsObj = JSON.parse(items);

      // find the index of the item to delete
      const itemIndex = itemsObj.findIndex(
        (item) => Number(item.id) === Number(itemId)
      );

      if (itemIndex === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end("Item with the specified id doesn't exist");
      }

      // remove the item
      itemsObj.splice(itemIndex, 1);

      // delete the file
      fs.writeFile(filePath, JSON.stringify(itemsObj), (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end("failed to delete item");
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("Delete Successful");
      });
    });
  });
};

