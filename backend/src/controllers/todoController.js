const { Todo } = require('../models/Todo');
const jwt = require('jsonwebtoken');

const todoController = {
  // Get all TODOs
  getAllTodos: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
      const todos = await Todo.findAll({
        where: { UserId: userId },
      });
      res.json(todos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  //Get a todo with it's id
  getSpecificTodos: async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const { id } = req.params;
        const todo = await Todo.findOne(
            { where: { id, UserId: userId } }
        );
        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Add a new TODO
  addTodo: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
      const { title, description } = req.body;
      const newTodo = await Todo.create({ title, description, completed: false, UserId: userId });
      res.json(newTodo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Edit a TODO
  editTodo: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
      const { id } = req.params;
      const { title, description } = req.body;
      const updatedTodo = await Todo.update(
        { title, description },
        { where: { id, UserId: userId } }
      );
      res.json(updatedTodo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Delete a TODO
  deleteTodo: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
      const { id } = req.params;
      await Todo.destroy({ where: { id, UserId: userId } });
      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Complete a TODO (update status)
  completeTodo: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
      const { id } = req.params;
      const updatedTodo = await Todo.update(
        { completed: true },
        { where: { id, UserId: userId } }
      );
      res.json(updatedTodo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = todoController;
