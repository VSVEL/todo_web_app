const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.currentUser = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    req.currentUser = user;
    req.tokenUserId = decoded.userId;
    next();
    console.log(req.currentUser.id);
  } catch (error) {
    console.error('Authentication error:', error);
    req.currentUser = null;
    next();
  }
};

module.exports = authenticateUser;
