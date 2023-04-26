"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Todo }) {
      this.hasMany(Todo, { foreignKey: "userId", as: "Todo" });
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.INTEGER,
        // defaultValue: DataTypes.UUIDV4,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      sequelize,
      modelName: "user",
    }
  );
  return User;
};
