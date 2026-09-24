// ChatWidget : conversation avec Flora.
import { useState, useRef, useEffect } from 'react';
import { X as FiX, Send as FiSend } from 'lucide-react';
import { chatbotApi } from '../../services/api';
import chatIcon from '../../assets/chat/iconChatbot.webp';
import './ChatWidget.css';


const WELCOME_MESSAGE = {
  role: 'model',
  content: "Bonjour, je suis Flora. Une question sur les fleurs, une occasion à célébrer, ou envie de conseils personnalisés ? Je suis là pour vous accompagner.",
};

const SUGGESTIONS = [
  'Quel bouquet choisir pour un anniversaire ?',
  'Comment entretenir des roses ?',
  'Comment personnaliser mon bouquet ?',
];


export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

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
    const handleEscape = (event) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
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
      <button className="chat-bubble" onClick={() => setOpen(!open)} aria-label={open ? 'Fermer le chat avec Flora' : 'Ouvrir le chat avec Flora'} aria-expanded={open} aria-controls="flora-chat-window">
        {open ? <FiX /> : <img src={chatIcon} alt="Flora" className="chat-bubble-icon" />}
      </button>

      {open && (
        <div className="chat-window" id="flora-chat-window" role="dialog" aria-label="Conversation avec Flora">
          <div className="chat-header">
            <img src={chatIcon} alt="Flora" className="chat-header-avatar" />
            <div className="chat-header-text">
              <strong>Flora</strong>
              <span>Votre conseillère florale</span>
            </div>
          </div>

          <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.role}`}>
                {m.content}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="chat-suggestions" aria-label="Questions suggérées">
                <span>Pour commencer</span>
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}>{suggestion}</button>
                ))}
              </div>
            )}
            {sending && (
              <div className="chat-message model typing">
                <span></span><span></span><span></span>
              </div>
            )}
            {error && <div className="chat-error" role="alert">{error}</div>}
            <div ref={bottomRef} />
          </div>

          <form className="chat-input-bar" onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              aria-label="Votre message à Flora"
              placeholder="Écrivez à Flora..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <button type="submit" aria-label="Envoyer le message" disabled={sending || !input.trim()}>
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
