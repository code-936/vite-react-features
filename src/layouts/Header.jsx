import { NavLink } from 'react-router-dom';
import '../styles/Header.css';

export function Header() {
  return (
    <header className="header" role="banner">
      <nav className="app-nav" aria-label="Main navigation">
        <NavLink
          to="/login"
          className={({ isActive }) => `app-nav__link${isActive ? ' app-nav__link--active' : ''}`}
        >
          Login
        </NavLink>
        <NavLink
          to="/home"
          className={({ isActive }) => `app-nav__link${isActive ? ' app-nav__link--active' : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) => `app-nav__link${isActive ? ' app-nav__link--active' : ''}`}
        >
          Search Users
        </NavLink>
      </nav>
    </header>
  );
}
