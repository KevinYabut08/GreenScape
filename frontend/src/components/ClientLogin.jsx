import '../App.css';
import BackgroundVideo from '../assets/videos/vid_1.mp4'; 
import Logo from '../assets/img/Logo.png'; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../components/AxiosInstance';
import GoogleIcon from '@mui/icons-material/Google';

const ClientLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    // TEMP BYPASS LOGIN
    localStorage.setItem("user_id", "1");
    localStorage.setItem("access", "fake-token");
    localStorage.setItem("role", "client");
    localStorage.setItem("first_name", "CJ");

    navigate('/home');
    return;
  };

  const handleGoogleLogin = () => {
    
  };

  return (
    <div className="myBackground">
      <video autoPlay muted loop className="backgroundVideo">
        <source src={BackgroundVideo} type="video/mp4" />
      </video>

      <div className="loginForm">
        <div className="landingContent">
          <img src={Logo} alt="Logo" className="landingLogo" />
        </div>

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

        <button onClick={handleLogin}>LOGIN</button>
        <button onClick={() => navigate('/client-register')}>
          SIGN UP
        </button>
        or
        <button onClick={handleGoogleLogin}><GoogleIcon/></button>

        <p className='errorMsg'>{error}</p>
      </div>
    </div>
  );
};

export default ClientLogin;