const { Sequelize, DataTypes } = require("sequelize");
const { DB_INFO } = require("../config");
const config = DB_INFO.development;
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  { dialect: config.dialect }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database is connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model")(sequelize, DataTypes);

module.exports = db;
