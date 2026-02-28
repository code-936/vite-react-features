import { useNavigate, Link } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate('/home');
  };
  return (
    <div>
      This is Header.
      <button type="button" onClick={navigateHome}>
        Home
      </button>
      <Link to="/Login">Login</Link>
    </div>
  );
}
