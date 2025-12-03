import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavbarWrapper from './components/NavbarWrapper';
import Home from './pages/ClientHome';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Settings from './pages/Settings';
import Landing from './pages/LandingPage';
import EmployeeRegister from './pages/EmployeeRegister';
import ClientLogin from './components/ClientLogin';
import EmployeeLogin from './components/EmployeeLogin'; 
import EmployeeHome from './pages/EmployeeHome';
import ClientRegister from './pages/ClientRegister';

function App() {
  return (
    <Routes>
      {/* Public pages without Navbar */}
      <Route path="/" element={<Landing />} />
      <Route path="/client-login" element={<ClientLogin />} />
      <Route path="/employee-login" element={<EmployeeLogin />} />
      <Route path="/employee-register" element={<EmployeeRegister />} />
      <Route path='client-register' element={<ClientRegister/>}/>

      {/* Pages with Navbar */}
      <Route element={<NavbarWrapper />}>
        <Route path="/home" element={<Home />} />
        <Route path="/employeeHome" element={<EmployeeHome />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
