import { getAllItems,getOneItem ,addItem, updateItem, deleteItem} from "./services.js";

export const HandleRequest = (req, res) => {
  const route = req.url.toLowerCase();

  if (route === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end("Welcome to Homepage");
    return;
  } else if (route === "/getallitems" && req.method === "GET") {
    getAllItems(req, res);
    return;
  }
  else if (route === "/getsingleitem" && req.method === "GET"){
    getOneItem(req,res)
    return;
  }
  else if (route === "/addnewitem" && req.method === "POST"){
    addItem(req,res)
  }
  else if (route === "/updateitem" && req.method === "PATCH"){
    updateItem(req,res)
    return
  }
  else if (route === "/deleteitem" && req.method === "DELETE"){
    deleteItem(req,res)
    return;
  }
  
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end("invalid route");
};
