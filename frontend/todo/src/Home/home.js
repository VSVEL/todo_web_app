import * as MUI from '@mui/material'
import TodoApp from '../Todo/todo'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  async function logout() {
      localStorage.removeItem('token')
      navigate('/');
    
  }

    const handleAlertClose = () => {
      // Close the alert
      setShowAlert(false);
    };

    return (
      <div>
        <MUI.Box sx={{ flexGrow: 1, p: 4 }}>
          <MUI.AppBar>
            <MUI.Toolbar>
              <MUI.Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                TODO LIST
              </MUI.Typography>
              <MUI.Button color='error' variant='contained' onClick={logout}>Logout</MUI.Button>
            </MUI.Toolbar>
          </MUI.AppBar>
          <MUI.Box sx={{ mt: 10 }}>
            <TodoApp />
          </MUI.Box>
        </MUI.Box>
        <MUI.Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MUI.Alert onClose={handleAlertClose} severity="error">
            Something went wrong while logging out
          </MUI.Alert>
        </MUI.Snackbar>
      </div>
    );

}

export default Home;
