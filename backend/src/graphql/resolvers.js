const { User } = require('../models/User');
const { Todo } = require('../models/Todo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    user: async (_, { id }) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },
    todos: async (_, __, { currentUser }) => {
      try {
        if (!currentUser) {
          throw new Error("Unauthorized");
        }
        const todos = await Todo.findAll({ where: { userId: currentUser.id } });
        return todos;
      } catch (error) {
        console.error("Error fetching todos:", error);
        throw error;
      }
    },
    // Add other query resolvers here
  },
  Mutation: {
    
    // login: (_, { username, password }) => {
    //   // Perform authentication logic here (e.g., validate credentials against database)
    //   const user = User.findOne(user => user.username === username && user.password === password);
    //   if (!user) {
    //     throw new Error('Invalid username or password');
    //   }
    //   // Generate and return JWT token upon successful authentication
    //   const token = generateToken(user);
    //   return { token };
    // },
  

    register: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          username,
          password: hashedPassword,
        });
        const token = generateToken(newUser.id);
        context.res.json({ user: newUser, token });
      } catch (error) {
        console.error(error);
        context.res.status(500).json({ error: 'Internal Server Error' });
      }
    },

    logout: (_, __, context) => {
      try {
        // Assuming the token is sent in the Authorization header
        const token = context.req.headers.authorization.split(' ')[1];
        context.req.logout();
        // console.log(token);
        // You may want to add additional validation or checks on the token

        // Clear the token from the client side (e.g., local storage)
        // You can also use cookies for this purpose
        // Example using local storage:
        localStorage.removeItem('token');

        context.res.json({ message: 'Logged out successfully' });
      } catch (error) {
        console.error(error);
        context.res.status(500).json({ error: 'Internal Server Error' });
      }
    },
    createUser: async (_, { username, password }) => {
      try {
        const newUser = await User.create({ username, password });
        return newUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },
    createTodo: async (_, { title, description, completed }, { currentUser }) => {
      try {
        if (!currentUser) {
          throw new Error("Unauthorized");
        }
        const newTodo = await Todo.create({ title, description, completed, UserId: currentUser.id });
        return newTodo;
      } catch (error) {
        console.error("Error creating todo:", error);
        throw error;
      }
    },
    completeTodo: async (_, { todoId }, { currentUser }) => {
      try {
        if (!currentUser) {
          throw new Error("Unauthorized");
        }

        // Find the todo by ID and ensure it belongs to the current user
        const todo = await Todo.findOne({ where: { id: todoId, UserId: currentUser.id } });
        if (!todo) {
          throw new Error("Todo not found or unauthorized");
        }

        // Update the todo's completed status to true
        todo.completed = true;
        await todo.save();

        return todo;
      } catch (error) {
        console.error("Error completing todo:", error);
        throw error;
      }
    },
    deleteTodo: async (_, { todoId }, { currentUser }) => {
      try {
        if (!currentUser) {
          throw new Error("Unauthorized");
        }

        // Find the todo by ID and ensure it belongs to the current user
        const todo = await Todo.findOne({ where: { id: todoId, UserId: currentUser.id } });
        if (!todo) {
          throw new Error("Todo not found or unauthorized");
        }

        // Delete the todo
        await todo.destroy();

        return { message: "Todo deleted successfully" };
      } catch (error) {
        console.error("Error deleting todo:", error);
        throw error;
      }
    },

    
    // Add other mutation resolvers here
  },
  User: {
    todos: async (parent) => {
      try {
        const todos = await Todo.findAll({ where: { UserId: parent.id } });
        return todos;
      } catch (error) {
        console.error("Error fetching todos for user:", error);
        throw error;
      }
    },
  },
};

module.exports = resolvers;
