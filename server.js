const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const PORT = 8000;

//to enable CORS
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

//helps to parse the request and create the req.body object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "this is a node postgres JWT auth API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
