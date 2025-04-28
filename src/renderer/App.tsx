import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import violet from '../../assets/violet.png';
import './App.css';
import { useEffect } from 'react';

function Hello() {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('resize-window', {
      width: 700,
      height: 700,
    });
  }, []);
  return (
    <div className="Hello">
      <img width="700" alt="icon" className="mainImage" src={violet} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
