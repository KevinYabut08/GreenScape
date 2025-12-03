import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavbarWrapper from './components/NavbarWrapper';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Settings from './pages/Settings';
import Landing from './pages/LandingPage';
import Register from './pages/Register';
import Login from './components/Login';
import EmployeeLogin from './components/EmployeeLogin'; 
import EmployeeHome from './pages/EmployeeHome';

function App() {
  return (
    <Routes>
      {/* Public pages without Navbar */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/employee-login" element={<EmployeeLogin />} />
      <Route path="/register" element={<Register />} />

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
