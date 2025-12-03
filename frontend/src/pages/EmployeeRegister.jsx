import '../App.css';
import BackgroundVideo from '../assets/videos/vid_1.mp4'; 
import Logo from '../assets/img/Logo.png'; 
import Sponsor1 from '../assets/img/img-1.png';
import Sponsor2 from '../assets/img/img-2.png';
import Sponsor3 from '../assets/img/img-3.png';
import Sponsor4 from '../assets/img/img-4.png';
import Sponsor5 from '../assets/img/img-5.png';
import Sponsor6 from '../assets/img/img-6.png';
import Sponsor7 from '../assets/img/img-7.png';

import { useState } from 'react';
import { useNavigate } from "react-router-dom";   
import AxiosInstance from '../components/AxiosInstance'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();  

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!email || !password || !confirmPassword || !firstName || !lastName || !employeeNumber){
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await AxiosInstance.post('register/employee/', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        employee_number: employeeNumber
      });

      console.log(response.data);
      setSuccess('Employee account created successfully! Redirecting...');

      setEmail('');
      setEmployeeNumber('');
      setFirstName('');
      setLastName('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate("/employee-login");
      }, 1200);

    } catch (err) {
      console.error(err.response || err);
      if (err.response) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Something went wrong. Please try again.');
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
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Create Employee Account</button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

        <div className="sponsorsImg">
          {[Sponsor1, Sponsor2, Sponsor3, Sponsor4, Sponsor5, Sponsor6, Sponsor7].map((s, i) => (
            <img key={i} src={s} alt={`Sponsor ${i}`} style={{ width: '80px', height: 'auto' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;
