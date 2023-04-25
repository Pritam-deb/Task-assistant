const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
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

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "openletter",
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: db.sequelize,
      table: "sessions",
      checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
      expiration: 24 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session.
    }),
  })
);
router(app);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
