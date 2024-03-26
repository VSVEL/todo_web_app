import * as MUI from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';


const defaultTheme = MUI.createTheme({});

const Login = () => {

    const [token, setToken] = useState('');
    
    const navigate = useNavigate();


    let handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            const response = await fetch('http://192.168.3.222:3000/auth/login', {
                method: 'POST',
                body: JSON.stringify({ 'username': data.get('email'), 'password': data.get('password') }),
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Server returned ${response.status} ${response.statusText}`);
            }
    
            const responseData = await response.json();
            const token = responseData.token;
            localStorage.setItem('token', token);
            setToken(token);
            navigate('/home', { replace: true });
    
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };
    
      

    return (
        <MUI.ThemeProvider theme={defaultTheme}>
            <MUI.Container component="main" maxWidth="xs">
                <MUI.CssBaseline />
                <MUI.Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <MUI.Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </MUI.Avatar>
                    <MUI.Typography component="h1" variant="h5">
                        Sign in
                    </MUI.Typography>
                    <form onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <MUI.TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <MUI.TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <MUI.FormControlLabel
                            control={<MUI.Checkbox value="remember" color="primary" name='remember' />}
                            label="Remember me"
                        />
                        <MUI.Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </MUI.Button>
                        <MUI.Grid container>
                            <MUI.Grid item xs>
                                <MUI.Link href="#" variant="body2">
                                    Forgot password?
                                </MUI.Link>
                            </MUI.Grid>
                            <MUI.Grid item>
                                <MUI.Link href='/register' variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </MUI.Link>
                            </MUI.Grid>
                        </MUI.Grid>
                    </form>
                </MUI.Box>
            </MUI.Container>
        </MUI.ThemeProvider>
    );
}

export default Login