import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function NavbarWrapper() {
  return <Navbar content={<Outlet />} />;
}
