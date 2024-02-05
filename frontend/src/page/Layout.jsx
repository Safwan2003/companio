import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4">
        <ul className="flex justify-between items-center text-white">
          <li>
            <Link to="/" className="text-2xl font-extrabold hover:text-gray-100">Home</Link>
          </li>
          <li>
            <Link to="/company" className="text-2xl font-extrabold hover:text-gray-100">Company</Link>
          </li>
          <li>
            <Link to="/employee" className="text-2xl font-extrabold hover:text-gray-100">Employee</Link>
          </li>
        </ul>
      </nav>

      <div className="container mx-auto mt-8">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
