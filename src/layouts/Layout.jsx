import { Header } from './Header.jsx';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-layout" role="main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
