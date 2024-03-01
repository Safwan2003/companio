import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./page/Layout";
import Home from "./page/Home";
import Company from "./page/company/company"
import CompanyDashboard from "./page/company/companyDashboard"
import NoPage from "./page/NoPage";
import Employee from "./page/employee/employee";
import EmployeeDashboard from "./page/employee/EmployeeDashboard";
import Analytics from "./page/company/Analytics";
import Attendance from "./page/employee/Attendance";
import EmployeeProfile from "./page/employee/EmployeeProfile";
import EmployeeTask from "./page/employee/EmployeeTask";
import EmployeeCrud from "./page/company/Employeecrud";
import TaskDashboard from "./page/company/taskDashboard";
import CompanyProfile from "./page/company/CompanyProfile";
import AttendanceCompany from "./page/company/Attendance";
import Chat from "./page/chat/Chat";
import Chat2 from "./page/chat/Chat2";
import Chatbot from "./page/Chatbot";
import Userregister from "./page/chat/Userregistercheck";

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
          <Route path="companydashboard" element={<CompanyDashboard />} >
          <Route path="analytics" element={<Analytics />} />
          <Route path="employeecrud" element={<EmployeeCrud />} />
          <Route path="taskdashboard" element={< TaskDashboard/>} />
          <Route path="companyprofile"  element={< CompanyProfile/>} />
          <Route path="attendancecompany" element={< AttendanceCompany/>} />
          <Route path="chatbot" element={< Chatbot/>} />
          
          </Route>


          <Route path="employeedashboard" element={<EmployeeDashboard />} >
          <Route path="attendance" element={<Attendance />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="task" element={<EmployeeTask />} />
          <Route path="chatbot" element={< Chatbot/>} />
          </Route>
     
      <Route path="chat" element={< Chat/>} />
      <Route path="chat2" element={< Chat2/>} />
      <Route path="check" element={< Userregister/>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App