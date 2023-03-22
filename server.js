const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = 8080;

//helps to parse the request and create the req.body object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "this is a node postgres JWT auth API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
