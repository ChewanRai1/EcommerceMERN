import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Container from "react-bootstrap/Container";

import AppNavbar from "./components/AppNavbar";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import News from "./pages/News";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./components/ForgotPassword"; // Ensure the correct import
import VerifyOTP from "./components/VerifyOTP";
import ChangePassword from "./components/ChangePassword"; // Next step

import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import CourseView from "./pages/CourseView"; // <---
import AddCourse from "./components/AddCourse";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Footer from "./components/Footer";
import BannerSlider from "./components/Banner";

function App() {
  const [user, setUser] = useState({
    // <---
    id: null,
    email: null,
    firstName: null,
    lastName: null,
    mobileNo: null,
    isAdmin: null,
  });
  // unsetUser function, clears the values and keys saved in localStorage
  function unsetUser() {
    // <---
    localStorage.clear();
  }
  function retrieveUserDetails(token) {
    fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("getProfile output:");
        console.log(data);

        if (typeof data !== undefined) {
          setUser({
            id: data._id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            mobileNo: data.mobileNo,
            isAdmin: data.isAdmin,
          });
        } else {
          setUser({
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            mobileNo: null,
            isAdmin: null,
          });
        }
      });
  }
  // useEffect(()=>{ // <--
  //   console.log(user);
  //   console.log(localStorage);
  //   retrieveUserDetails(localStorage.getItem('token'));
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      retrieveUserDetails(token);
    } else {
      setUser({
        id: null,
        email: null,
        firstName: null,
        lastName: null,
        mobileNo: null,
        isAdmin: null,
      });
    }
  }, []);
  /*
    <Router> serves as a container for the entire routing logic
    <Routes> is a container for organizing multiple <Route> components
    <Route> is used to define a specific route, specifying the path and the component to render when that path is matched
  */
  return (
    <>
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <AppNavbar />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/addCourse" element={<AddCourse />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseView />} />
              <Route path="/news" element={<News />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route
                path="/change-password"
                element={<ChangePassword />}
              />{" "}
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </Container>
          <Footer />
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
