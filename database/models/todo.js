// const { Sequelize } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Todo = sequelize.define("todo", {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { message: "Should not be Empty" },
      },
    },
    isCompleted: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return User;
};
