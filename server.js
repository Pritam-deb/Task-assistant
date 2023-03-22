const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./database/models");
const Role = db.role;

const PORT = 8000;

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync database");
  initial();
});
//routes
require("./src/routes/auth")(app);
require("./src/routes/user")(app);
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
