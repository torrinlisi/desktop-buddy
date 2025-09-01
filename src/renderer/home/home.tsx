import { useEffect, useRef, useState } from 'react';
import violet from '../../../assets/violet.png';
import './home.css';
import { faGripVertical, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Home = () => {
  const textareaRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState('... what?');
  const [text, setText] = useState('');
  const [nowFloating, setNowFloating] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resetState();
    window.electron.ipcRenderer.sendMessage('resize-window', {
      width: isSpeaking ? 1000 : 700,
      height: 700,
    });
  }, [isSpeaking]);

  useEffect(() => {
    // start floating
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      setNowFloating(false);
      window.electron.ipcRenderer.sendMessage('stop-floating');
      timer = setTimeout(() => {
        setNowFloating(true);
        window.electron.ipcRenderer.sendMessage('start-floating');
      }, 100000);
    };

    resetTimer();

    // stop floating
    const handleMouseEnter = () => {
      setNowFloating(false);
      resetTimer();
      window.electron.ipcRenderer.sendMessage('stop-floating');
    };

    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, []);

  const generateText = () => {
    setLoading(true);
    setText('');
    window.electron.ipcRenderer.sendMessage('openai-request', { prompt: text });
    window.electron.ipcRenderer.on('openai-response', (response) => {
      setResponse(response as string);
      setLoading(false);
    });
  };

  const resetState = () => {
    setNowFloating(false);
    setText('');
    setResponse('... what?');
  };

  return (
    <div className="mainImageContainer" ref={mainContainerRef}>
      {isSpeaking && !nowFloating ? (
        <>
          <div className="expandedChatBubble">
            <div className="generatedTextContainer">
              {loading ? (
                <span className="loading-dots">
                  <span className="dot dot1">.</span>
                  <span className="dot dot2">.</span>
                  <span className="dot dot3">.</span>
                </span>
              ) : (
                response
              )}
            </div>
            <div className="typingTextContainer">
              <textarea
                ref={textareaRef}
                className="typingText"
                onChange={(e) => setText(e.target.value)}
                value={text}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('Enter pressed');

                    generateText();
                  }
                }}
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
          {!nowFloating && (
            <>
              <div className="chatBubble" onClick={() => setIsSpeaking(true)}>
                Have anything to say??
              </div>
              <div className="buttonContainer">
                <div className="dragHandle">
                  <FontAwesomeIcon icon={faGripVertical} />
                </div>
              </div>
            </>
          )}
          <img width="700" alt="icon" src={violet} />
        </>
      )}
    </div>
  );
};
