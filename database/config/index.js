require("dotenv").config();

module.exports = {
  JWT_SECRET: "0P3NL3TTER",
  JWT_REFRESH_SECRET: "HJE5678THUG834567THJG84576TEHJGT",
  DB_INFO: {
    development: {
      username: "pritamdebnath",
      password: "",
      database: "todo_app",
      host: "localhost",
      dialect: "postgres",
    },
  },
};

//.env stores these data
