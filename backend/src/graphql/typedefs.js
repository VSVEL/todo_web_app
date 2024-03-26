// typedefs.js

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    todos: [Todo]
  }

  type Todo {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    UserId: ID!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    todos: [Todo]
    # Add other queries here
  }


  type Mutation {
    createUser(username: String!, password: String!): User
    createTodo(title: String!, description: String, completed: Boolean!, userId:ID!): Todo
    deleteTodo(todoId:ID!):Todo
    completeTodo(todoId:ID!):Todo
    login(username:String!,password:String!): AuthPayload!
    register(username:String!,password:String!): String!
    logout: String!
  }
`;

module.exports = typeDefs;
