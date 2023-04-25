const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./database/models");
const router = require("./src/routes");
const app = express();

const PORT = 8080;

//helps to parse the request and create the req.body object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

db.sequelize.sync({ force: false }).then(() => {
  console.log("DB has been resynced!");
});
router(app);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
