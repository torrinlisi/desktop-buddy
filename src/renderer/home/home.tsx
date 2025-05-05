import { useEffect, useRef, useState } from 'react';
import violet from '../../../assets/violet.png';
import './home.css';
import { faGripVertical, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Home = () => {
  const textareaRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState('testing ');
  const [text, setText] = useState('');

  // useEffect(() => {
  //   window.electron.ipcRenderer.sendMessage('resize-window', {
  //     width: 700,
  //     height: 700,
  //   });
  // }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('resize-window', {
      width: isSpeaking ? 1000 : 700,
      height: 700,
    });
  }, [isSpeaking]);

  return (
    <div className="mainImageContainer">
      {isSpeaking ? (
        <>
          <div className="expandedChatBubble">
            <div className="generatedTextContainer"></div>
            <div className="typingTextContainer">
              <textarea
                ref={textareaRef}
                className="typingText"
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
          <div className="buttonContainer">
            <div className="closeButton" onClick={() => setIsSpeaking(false)}>
              <FontAwesomeIcon icon={faX} />
            </div>
            <div className="dragHandle">
              <FontAwesomeIcon icon={faGripVertical} />
            </div>
          </div>

          <img width="700" alt="icon" src={violet} />
        </>
      ) : (
        <>
          <div className="chatBubble" onClick={() => setIsSpeaking(true)}>
            Have anything to say??
          </div>
          <div className="buttonContainer">
            <div className="dragHandle">
              <FontAwesomeIcon icon={faGripVertical} />
            </div>
          </div>
          <img width="700" alt="icon" src={violet} />
        </>
      )}
    </div>
  );
};
