import { useEffect, useState } from 'react';
import violet from '../../../assets/violet.png';
import './home.css';

export const Home = () => {
  const [isDraggable, setIsDraggable] = useState(true);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('resize-window', {
      width: 700,
      height: 700,
    });
  }, []);

  return (
    <div className="mainImageContainer">
      <div className="chatBubble" onClick={() => console.log('test')}>
        Have anything to say??
      </div>
      <div className="dragHandle">⠿</div>
      <img width="700" alt="icon" src={violet} />
    </div>
  );
};
