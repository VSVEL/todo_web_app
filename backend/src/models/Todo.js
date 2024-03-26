const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const { User } = require('../models/User');

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Todo.belongsTo(User);
User.hasMany(Todo);

module.exports = {
    Todo,
};
