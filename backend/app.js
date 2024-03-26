const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');
const todoRoutes = require('./src/routes/todoRoutes');
const { sequelize } = require('./src/utils/database');
const cors = require('cors');
const typeDefs = require('./src/graphql/typedefs');
const resolvers = require('./src/graphql/resolvers');
const authenticateUser = require('../backend/src/middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(authenticateUser);

// Routes
app.use('/auth', authRoutes);
app.use('/api', todoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Database synchronization
sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized.');

  // Apollo Server setup
  const server = new ApolloServer({ typeDefs, resolvers,
    context: ({ req }) => {
      // You can access the authenticated user from req.currentUser
      return { currentUser: req.currentUser };
    },
  
  });

  // Start the server first
  server.start().then(() => {
    // Apply Apollo middleware to Express
    server.applyMiddleware({ app });
  
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
});
