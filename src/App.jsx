import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login.jsx';
import Layout from './layouts/Layout.jsx';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import VirtualAssistant from './features/VirtualAssistant/components/VirtualAssistant.jsx';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <nav className="app-nav" aria-label="Main navigation">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
              }
            >
              Search Users
            </NavLink>
          </nav>

          {/* *** Need to implement: 1. Nested Layouts with <Outlet /> 2. Use Data Loaders feature of React Router *** */}

          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/home/:userName" element={<Home />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </Layout>

          <VirtualAssistant />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
