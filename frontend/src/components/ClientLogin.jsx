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
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../components/AxiosInstance';

const ClientLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await AxiosInstance.post('login/client/', {
        email: email,
        password: password
      });

      console.log("Client login success:", response.data);

      navigate('/home');

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

        <button onClick={handleLogin}>Login</button>

        <button onClick={() => navigate('/client-register')}>
          Sign Up
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <div className="sponsorsImg">
          {[Sponsor1, Sponsor2, Sponsor3, Sponsor4, Sponsor5, Sponsor6, Sponsor7].map((s, i) => (
            <img key={i} src={s} alt={`Sponsor ${i}`} style={{ width: '80px', height: 'auto' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
