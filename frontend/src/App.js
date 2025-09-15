import { AuthProvider } from "./context/AuthContext";
import { MainDataProvider } from "./context/MainDataContext";
import "./App.css";
import Home from "./Pages/Home/Home";
import Skills from "./Pages/Skills/Skills";
import Projects from "./Pages/Projects/Projects";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgotPassword from "./Pages/Forgot-Password/Forgot-Password";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import Admin from "./Pages/Admin/Admin";
import AdminHome from "./Pages/AdminHome/AdminHome";
import AdminSkills from "./Pages/AdminSkills/AdminSkills";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthProvider>
      <MainDataProvider>
        <div className="App">
          <BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/skills" element={<Skills />}></Route>
              <Route path="/projects" element={<Projects />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              ></Route>
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              ></Route>
              <Route path="/admin" element={<Admin />}></Route>
              <Route path="/admin/home" element={<AdminHome />}></Route>
              <Route path="/admin/skills" element={<AdminSkills />}></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </MainDataProvider>
    </AuthProvider>
  );
}

export default App;
