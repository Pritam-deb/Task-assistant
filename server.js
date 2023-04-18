const express = require("express");

const cookieParser = require("cookie-parser");
const db = require("./database/models");
const userRoutes = require("./src/routes/auth");
const protectedRoutes = require("./src/routes/protectedRoutes");
const googleAuthRouter = require("./src/routes/googleAuth");
const { requireAuth } = require("./src/middlewares/auth");

const app = express();

const PORT = 8080;

//helps to parse the request and create the req.body object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

db.sequelize.sync({ force: false }).then(() => {
  console.log("DB has been resynced!");
});

app.use("/api/google", googleAuthRouter);
app.use("/api/users", userRoutes);
app.use("/api/todo", requireAuth, protectedRoutes);

app.get("/", (req, res) => {
  res.json({ message: "this is a node postgres JWT auth API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
