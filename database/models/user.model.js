"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      uuid: {
        type: DataTypes.INTEGER,
        // defaultValue: DataTypes.UUIDV4,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Todo, {
      foreignKey: "userId",
      sourceKey: "uuid",
      onDelete: "CASCADE",
    });
  };

  return User;
};
