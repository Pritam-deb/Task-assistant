const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./database/models");
const router = require("./src/routes");
const app = express();
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const { checkTodosDueInThreeDays } = require("./src/utils");
const cron = require("node-cron");

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

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
app.use(passport.authenticate("session"));
db.sequelize.sync({ force: false }).then(() => {
  console.log("DB has been resynced!");
});
router(app);

cron.schedule("00 11 * * *", () => {
  checkTodosDueInThreeDays();
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
