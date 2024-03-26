import React, { useState, useEffect } from 'react';
import TodoCard from '../TodoCard/todoCard';
import * as MUI from '@mui/material';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", content: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);


  const GET_USER_TODOS = gql`
    query GetUserTodos($userId: ID!) {
      user(id: $userId) {
        id
        username
        todos {
          id
          title
          description
          completed
        }
      }
    }
  `;

  const UPDATE_TODO = gql `
    mutation UpdateTodo($todoId: ID!) {
      id
      description
      title
      completed
    }
  `;

  const [GetUserTodos,{ data: fetchTodo }] = useLazyQuery(GET_USER_TODOS, { 
    variables: { userId: "2" }, 
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  });

  // const [UpdateTodo,{data: todo }] = useLazyQuery(UPDATE_TODO,{
  //   variables:{todoId: "30"},
  //   context: {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   },
  // })

  useEffect(() => {
    // Initial fetch of todo list
    GetUserTodos();
  }, []);

  useEffect(() => {
    // Fetch todos when fetchTodo data changes
    fetchTodos();
  }, [fetchTodo]);

  const fetchTodos = () => {
    if (fetchTodo && fetchTodo.user) {
      setTodos(fetchTodo.user.todos);
    }
  };


  const getTodoList = async () => {
    try {
      const response = await fetch('http://192.168.3.222:3000/api/todos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      //const {loading, error, data} = useLazyQuery(GET_USER_TODOS, );
      setTodos(responseData);

    } catch (error) {
      console.error('Error getting todo list:', error);
    }
  }

  useEffect(() => {
    // Initial fetch of todo list
    //getTodoList();
    fetchTodos();
  }, []);

  //console.log(todos);

  const handleToggle = async (todoId) => {
    try {
      const response = await fetch(`http://192.168.3.222:3000/api/todos/${todoId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Update the completed status in the state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        )
      );
      // const { data } = await UpdateTodo({
      //   variables: { todoId },
      // });

    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const submitNote = async () => {
    try {
      if (editMode) {
        // Update existing todo
        const response = await fetch(`http://192.168.3.222:3000/api/todos/${editTodoId}`, {
          method: 'PUT',
          body: JSON.stringify({ 'title': newTodo.title, 'description': newTodo.content }),
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }

        setEditMode(false); // Reset edit mode after updating
      } else {
        // Add new todo
        const response = await fetch('http://192.168.3.222:3000/api/todos', {
          method: 'POST',
          body: JSON.stringify({ 'title': newTodo.title, 'description': newTodo.content }),
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }

        setShowAlert(true);
      }

      // Fetch the updated todo list after adding/updating a todo
      getTodoList();

      // Reset the newTodo state
      setNewTodo({ title: "", content: "" });
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  }

  const handleAlertClose = () => {
    // Close the alert
    setShowAlert(false);
  };

  const handleEdit = (id) => {
    // Find the todo by id
    const todoToEdit = todos.find((todo) => todo.id === id);

    // Populate the form with the todo data
    setNewTodo({
      title: todoToEdit.title,
      content: todoToEdit.description,
    });

    // Set edit mode and the id of the todo being edited
    setEditMode(true);
    setEditTodoId(id);
  };

  const handleDelete = async (id) => {
    try {
      let response = await fetch('http://192.168.3.222:3000/api/todos/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }

      });

      if (!response.ok) {

      }

      getTodoList();

    } catch (e) {
      console.log(e);
    }
    console.log('DELETE');
    console.log(id);
  }

  return (
    <div>
      <MUI.Box sx={{ margin: 'auto', maxWidth: 400, marginBottom: '16px' }}>
        <MUI.Card sx={{ width: '100%' }}>
          <MUI.CardContent>
            <MUI.TextField
              margin="normal"
              required
              name="title"
              label="Title"
              id="title"
              fullWidth
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            />
            <MUI.TextField
              margin="normal"
              required
              name="content"
              label="Content"
              id="content"
              fullWidth
              multiline
              rows={2}
              value={newTodo.content}
              onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })}
            />
          </MUI.CardContent>
          <MUI.Box>
            <MUI.CardActions sx={{ justifyContent: 'center' }}>
              <MUI.Button variant="contained" color="primary" sx={{ width: '50%' }} onClick={submitNote} disabled={!newTodo.title || !newTodo.content} >
                {editMode ? 'Update' : 'Add'}
              </MUI.Button>
            </MUI.CardActions>
          </MUI.Box>
        </MUI.Card>
      </MUI.Box>

      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} onToggle={handleToggle} onEdit={handleEdit} onDelete={handleDelete} />
      ))}

      <MUI.Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MUI.Alert onClose={handleAlertClose} severity="success">
          Todo is added to the list.
        </MUI.Alert>
      </MUI.Snackbar>
    </div>

  );
};

export default TodoApp;
