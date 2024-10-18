// src/Components/Layout/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar"; // Assume you have a Navbar component

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;
