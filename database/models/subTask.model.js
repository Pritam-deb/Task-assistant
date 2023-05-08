"use strict";

module.exports = (sequelize, DataTypes) => {
  const subTask = sequelize.define(
    "subTask",
    {
      subTaskID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { message: "Should not be Empty" },
        },
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  return subTask;
};
