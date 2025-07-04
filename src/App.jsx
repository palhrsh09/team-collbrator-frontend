import { BrowserRouter } from 'react-router-dom';
import Views from './routes';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
    <Navbar /> 
      <Views />
    </BrowserRouter>
  );
}