import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import Home from "./pages/Home.jsx";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <nav>
          <Link to="/home">Home</Link>
        </nav> */}

        {/* *** Need to implement: 1. Nested Layouts with <Outlet /> 2. Use Data Loaders feature of React Router *** */}

        <Layout>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/home/:userName" element={<Home />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
