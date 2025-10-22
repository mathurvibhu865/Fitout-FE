import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Fitout from './pages/Fitout';
import LoginService from './services/LoginService';


function App() {
  return (
    <Router>
      <Routes>
        
         <Route path="/" element={<LoginService />} />
          <Route path="/fitout" element={<Fitout />} />
          
      </Routes>
    </Router>
  );
}

export default App;

