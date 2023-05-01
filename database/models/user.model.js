"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Todo }) {
      this.hasMany(Todo, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        // defaultValue: DataTypes.UUIDV4,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userEmail: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          isEmail: {
            msg: "You must add a valid email address",
          },
        },
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
