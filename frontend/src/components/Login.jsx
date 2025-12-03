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
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

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

        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />

        <button>Login</button>
        <button onClick={() => navigate('/register')}>
          Sign up
        </button>

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

export default Login;
