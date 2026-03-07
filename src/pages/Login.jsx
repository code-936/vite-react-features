import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useApiMutation } from '../services/apiServices';
import useApiAxios from '../hooks/useApiAxios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Using the API mutation hook - Tanstack Query
  // const { mutate, isPending, isError, isSuccess, data, error } = useApiMutation(
  //   // 'https://dummyjson.com/auth/login',
  //   'http://localhost:3001/auth/login',
  //   'POST'
  // );

  // Using the API mutation hook - Axios
  const { mutate, isPending, isError, isSuccess, data, error } = useApiAxios({
    // url: 'https://dummyjson.com/auth/login',
    url: 'http://localhost:3001/auth/login',
    method: 'POST',
    immediate: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');

    // Call the API mutation
    // mutate(
    //   { username, password },
    //   {
    //     onSuccess: (response) => {
    //       console.log('Login successful:', response);
    //       if (response.data) {
    //         // Store user data in localStorage
    //         console.log('response', response);
    //         const userData = {
    //           isAuthenticated: true,
    //           username: response.data.user.username || username,
    //           token: response.data.user.token,
    //           ...response.data.user,
    //         };
    //         localStorage.setItem('user', JSON.stringify(userData));
    //         console.log('User data stored in localStorage:', localStorage.getItem('user'));
    //         navigate('/users');
    //       }
    //     },
    //     onError: (err) => {
    //       console.error('Login failed:', err);
    //     },
    //   }
    // );
    await mutate(
      { username, password },
      {
        onSuccess: (response) => {
          console.log('Login successful:', response);
          if (response.data) {
            const userData = {
              isAuthenticated: true,
              username: response.data.user.username || username,
              token: response.data.user.token,
              ...response.data.user,
            };
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('User data stored in localStorage:', localStorage.getItem('user'));
            navigate('/users');
          }
        },
        onError: (err) => {
          console.error('Login failed:', err);
        },
      }
    );
  };

  return (
    <div>
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <TextField id="standard-basic" label="Standard" variant="standard" /> */}

        <TextField
          id="id-username"
          label="Username"
          variant="filled"
          required
          //   disabled
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="id-password"
          label="Password"
          variant="filled"
          type="password"
          required
          //   disabled
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* commented to replace with MUI Box and TextField components*/}
        {/* <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div> */}
        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Submit'}
        </Button>

        {isError && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            Error: {error?.message || 'Login failed'}
          </div>
        )}
        {isSuccess && data?.error && (
          <div style={{ color: 'red', marginTop: '10px' }}>Error: {data.error}</div>
        )}
        {isSuccess && data?.data && (
          <div style={{ color: 'green', marginTop: '10px' }}>Login successful!</div>
        )}
      </Box>
    </div>
  );
};

export default Login;
