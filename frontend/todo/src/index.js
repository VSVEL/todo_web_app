import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import CssBaseline from '@mui/material/CssBaseline';
import { setContext } from "@apollo/client/link/context";
import config from '../src/Apollo/config';
import { apolloClient } from './Apollo/apollo';

const root = ReactDOM.createRoot(document.getElementById('root'));




root.render(
  <ApolloProvider client={apolloClient}>
    <CssBaseline />
    <App />
  </ApolloProvider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
