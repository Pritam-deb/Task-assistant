require("dotenv").config();

module.exports = {
  JWT_SECRET: "0P3NL3TTER",
  JWT_REFRESH_SECRET: "HJE5678THUG834567THJG84576TEHJGT",
  CLIENT_ID:
    "523872834988-66fnc3ni5j6bhuff8rf88kad2f3e5spj.apps.googleusercontent.com",
  CLIENT_SECRET: "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",
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
