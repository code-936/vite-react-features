import { useEffect, useReducer } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useApiQuery } from '../services/apiServices';
import './Users.css';

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

const usersReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, users: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const Users = () => {
  //   useEffect(() => {
  //     const fetchUsers = async () => {
  //       fetch('http://localhost:8000/users?role=admin')
  //         .then((res) => res.json())
  //         .then((data) => {
  //           console.log('res data: ', data);
  //           setUsers(data);
  //         })
  //         .catch((err) => {
  //           console.error(JSON.stringify(err));
  //         });
  //     };

  //     fetchUsers();
  //   }, []);
  const [state, dispatch] = useReducer(usersReducer, initialState);

  const { isPending, isError, data, error } = useApiQuery('http://localhost:8000/users', {
    role: 'admin',
  });

  useEffect(() => {
    if (isPending) {
      dispatch({ type: 'FETCH_INIT' });
    } else if (isError) {
      dispatch({ type: 'FETCH_ERROR', payload: error?.message });
    } else if (data) {
      dispatch({ type: 'FETCH_SUCCESS', payload: data?.data ?? [] });
    }
  }, [isPending, isError, data, error]);

  if (state.isLoading) return <div>Loading...</div>;
  if (state.error) return <div>Error: {state.error}</div>;

  return (
    <div className="users-container">
      <h2>Users</h2>
      <TableContainer component={Paper} className="users-table-wrapper">
        <Table>
          <TableHead className="users-table-head">
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.users.map((user) => (
              <TableRow key={`${user.id}-${user.username}`} className="users-table-row">
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
