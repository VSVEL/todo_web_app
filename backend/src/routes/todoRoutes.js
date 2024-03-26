const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

router.get('/todos', todoController.getAllTodos);
router.get('/todos/:id', todoController.getSpecificTodos);
router.post('/todos', todoController.addTodo);
router.put('/todos/:id', todoController.editTodo);
router.delete('/todos/:id', todoController.deleteTodo);
router.put('/todos/:id/complete', todoController.completeTodo);

module.exports = router;
