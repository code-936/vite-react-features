import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login.jsx';
import Layout from './layouts/Layout.jsx';
import Home from './pages/Home.jsx';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* <nav>
          <Link to="/home">Home</Link>
        </nav> */}

          {/* *** Need to implement: 1. Nested Layouts with <Outlet /> 2. Use Data Loaders feature of React Router *** */}

          <Layout>
            <Routes>
              <Route path="/Login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/home/:userName" element={<Home />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
