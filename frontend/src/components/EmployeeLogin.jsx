import '../App.css';
import BackgroundVideo from '../assets/videos/vid_1.mp4'; 
import Logo from '../assets/img/Logo.png'; 

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../components/AxiosInstance';

const EmployeeLogin = () => {
  const navigate = useNavigate();

  const [employeeNumber, setEmployeeNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!employeeNumber || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await AxiosInstance.post('login/employee/', {
        employee_number: employeeNumber,
        email: email,
        password: password
      });

      console.log("Login success:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("first_name", response.data.user.first_name);
      navigate('/employeeHome');

    } catch (err) {
      console.error(err.response || err);

      if (err.response) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Something went wrong. Please try again.");
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
          onChange={e => setEmployeeNumber(e.target.value)}
        />

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <button onClick={() => navigate('/employee-register')}>
          Sign Up
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
   
      </div>
    </div>
  );
};

export default EmployeeLogin;
