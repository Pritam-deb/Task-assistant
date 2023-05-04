"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      userId: {
        type: DataTypes.INTEGER,
        // defaultValue: DataTypes.UUIDV4,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
