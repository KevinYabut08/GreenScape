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
import AxiosInstance from '../components/AxiosInstance'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await AxiosInstance.post('register/', {
        email,
        password
      });
      console.log(response.data);
      setSuccess('Account created successfully!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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

        <button onClick={handleRegister}>Create Account</button>  

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

        <div className="sponsorsImg">
          <img src={Sponsor1} alt="Sponsor 1" style={{ width: '80px', height: 'auto' }} />
          <img src={Sponsor2} alt="Sponsor 2" style={{ width: '80px', height: 'auto' }} />
          <img src={Sponsor3} alt="Sponsor 3" style={{ width: '80px', height: 'auto' }} />
          <img src={Sponsor4} alt="Sponsor 1" style={{ width: '80px', height: 'auto' }} />
          <img src={Sponsor5} alt="Sponsor 2" style={{ width: '80px', height: 'auto' }} />
          <img src={Sponsor6} alt="Sponsor 3" style={{ width: '80px', height: 'auto' }} />
          <img src={Sponsor7} alt="Sponsor 3" style={{ width: '80px', height: 'auto' }} />
        </div> 
      </div>
    </div>
  );
};

export default Register;
