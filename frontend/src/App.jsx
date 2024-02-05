import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./page/Layout";
import Home from "./page/Home";
import Company from "./page/company/company"
import CompanyDashboard from "./page/company/companyDashboard"
import NoPage from "./page/NoPage";
import Employee from "./page/employee/employee";
import EmployeeDashboard from "./page/employee/EmployeeDashboard";

 function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="company" element={<Company />} />
          <Route path="employee" element={<Employee />} />
          <Route path="*" element={<NoPage />} />
        </Route>
          <Route path="employeedashboard" element={<EmployeeDashboard />} />
          <Route path="companydashboard" element={<CompanyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App