module.exports = {
    development: {
      dialect: 'postgres',
      host: '142.132.163.51',
      port: 5432,
      username: 'postrges',
      password: '560037',
      database: 'todo_app_dev',
    },
    test: {
      dialect: 'postgres',
      host: '142.132.163.51',
      port: 5432,
      username: 'postrges',
      password: '560037',
      database: 'todo_app_test',
    },
    production: {
      dialect: 'postgres',
      use_env_variable: '142.132.163.51', // Make sure to set DATABASE_URL in production environment
    },
  };
  