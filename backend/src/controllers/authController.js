const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { generateToken } = require('../utils/authentication');

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username,
        password: hashedPassword,
      });
      const token = generateToken(newUser.id);
      res.json({ user: newUser, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Login existing user
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);
      res.json({ token, username });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Logout (optional, depending on your requirements)
  logout: (req, res) => {
    try {
      // Assuming the token is sent in the Authorization header
      const token = req.headers.authorization.split(' ')[1];
      console.log(token);
      req.logout();
  
      // You may want to add additional validation or checks on the token
  
      // Clear the token from the client side (e.g., local storage)
      // You can also use cookies for this purpose
      // Example using local storage:
      // localStorage.removeItem('token');
  
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = authController;
