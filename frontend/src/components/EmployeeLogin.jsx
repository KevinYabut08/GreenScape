import "../App.css";
import BackgroundVideo from "../assets/videos/vid_1.mp4";
import Logo from "../assets/img/Logo.png";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../components/AxiosInstance";

const EmployeeLogin = () => {
  const navigate = useNavigate();

  const [employeeNumber, setEmployeeNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const payload = {
        email,
        password,
      };

      if (employeeNumber.trim() !== "") {
        payload.employee_number = employeeNumber.trim();
      }

      console.log("Sending login payload:", payload);

      const response = await AxiosInstance.post("login/employee/", payload);

      console.log("Login response:", response.data);

      const { access, user } = response.data;
      const group = user?.group || "";

      localStorage.clear();

      // Store auth/session info
      localStorage.setItem("access", access);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      localStorage.setItem("group", group);
      localStorage.setItem("first_name", user.first_name || "");
      localStorage.setItem("last_name", user.last_name || "");
      localStorage.setItem("employee_number", user.employee_number || "");

      console.log("Logged in user group:", group);

      if (group === "Staff" || group === "Supervisor" || group === "Admin") {
        try {
          const meRes = await AxiosInstance.get("core/employees/me/");
          const employee = meRes.data;

          const profileComplete =
            employee.firstname &&
            employee.lastname &&
            employee.phonenumber &&
            employee.address;

          if (!profileComplete) {
            navigate("/employee/complete-profile");
            return;
          }

          navigate("/employeeHome");
          return;
        } catch (err) {
          if (err.response?.status === 404) {
            navigate("/employee/complete-profile");
            return;
          }

          console.error("Employee profile check failed:", err.response?.data || err);
          throw err;
        }
      } else if (group === "SuperAdmin") {
        navigate("/employeeHome");
        return;
      }

      setError("Your account has no assigned role/group. Please contact support.");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.non_field_errors?.length) {
        setError(err.response.data.non_field_errors[0]);
      } else if (err.response?.data?.email?.length) {
        setError(err.response.data.email[0]);
      } else if (err.response?.data?.employee_number?.length) {
        setError(err.response.data.employee_number[0]);
      } else if (err.response?.data?.password?.length) {
        setError(err.response.data.password[0]);
      } else if (typeof err.response?.data === "string") {
        setError(err.response.data);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="myBackground">
      <video autoPlay muted loop className="backgroundVideo">
        <source src={BackgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="loginForm">
        <div className="landingContent">
          <img src={Logo} alt="Logo" className="landingLogo" />
        </div>

        <input
          type="text"
          placeholder="Employee Number"
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
          maxLength={20}
        />

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={50}
        />

        <button onClick={handleLogin}>LOGIN</button>

        <button onClick={() => navigate("/employee-register")}>
          SIGN UP
        </button>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default EmployeeLogin;