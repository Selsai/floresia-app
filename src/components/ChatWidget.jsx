import { useState, useRef, useEffect } from 'react';
import { FiX, FiSend } from 'react-icons/fi';
import { chatbotApi } from '../services/api';
import chatIcon from '../assets/icons/iconChatbot.png';
import './ChatWidget.css';


const WELCOME_MESSAGE = {
  role: 'model',
  content: "Bonjour, je suis Flora 🌸 Une question sur les fleurs, une occasion à célébrer, ou envie de conseils personnalisés ? Je suis là pour vous accompagner.",
};


export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const newMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setError('');
    setSending(true);

    try {
      const history = newMessages
        .filter((m) => m !== WELCOME_MESSAGE)
        .map((m) => ({ role: m.role, content: m.content }));

      const { reply } = await chatbotApi.sendMessage(trimmed, history.slice(0, -1));
      setMessages((prev) => [...prev, { role: 'model', content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={wrapperRef}>
      <button className="chat-bubble" onClick={() => setOpen(!open)} aria-label="Ouvrir le chat avec Flora">
        {open ? <FiX /> : <img src={chatIcon} alt="Flora" className="chat-bubble-icon" />}
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <img src={chatIcon} alt="Flora" className="chat-header-avatar" />
            <div className="chat-header-text">
              <strong>Flora</strong>
              <span>Votre conseillère florale</span>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.role}`}>
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="chat-message model typing">
                <span></span><span></span><span></span>
              </div>
            )}
            {error && <div className="chat-error">{error}</div>}
            <div ref={bottomRef} />
          </div>

          <form className="chat-input-bar" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Écrivez à Flora..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <button type="submit" disabled={sending || !input.trim()}>
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}