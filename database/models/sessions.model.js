"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sessions extends Model {}
  Sessions.init(
    {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expires: DataTypes.DATE,
      data: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "sessions",
      timestamps: false,
    }
  );
  return Sessions;
};
