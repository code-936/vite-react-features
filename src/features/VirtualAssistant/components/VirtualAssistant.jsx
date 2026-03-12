import { useEffect, useMemo, useRef, useState } from 'react';
import useVirtualAssistant from '../hooks/useVirtualAssistant.js';
import './VirtualAssistant.css';

const VirtualAssistant = () => {
  const {
    sessionId,
    messages,
    isLoading,
    isMinimized,
    error,
    canSaveTranscript,
    sendMessage,
    toggleMinimize,
    saveTranscript,
    endConversation,
  } = useVirtualAssistant();
  const [input, setInput] = useState('');
  const [isEnding, setIsEnding] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const assistantStatusText = useMemo(() => {
    if (isLoading) {
      return 'Assistant is generating a response.';
    }

    if (error) {
      return `Assistant error: ${error}`;
    }

    return 'Assistant is ready.';
  }, [error, isLoading]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextInput = input.trim();
    if (!nextInput || isLoading) {
      return;
    }

    setInput('');
    await sendMessage(nextInput);
  };

  const onInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit(event);
      }
    }
  };

  const onEndConversation = () => {
    if (isEnding) {
      return;
    }

    setIsEnding(true);
    endConversation();
    setInput('');
    setTimeout(() => setIsEnding(false), 250);
  };

  return (
    <section className="va" aria-label="Virtual assistant">  
      {!isMinimized ? (
        <div
          id="virtual-assistant-panel"
          className="va__panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="virtual-assistant-title"
        >
          <header className="va__header">
            <div>
              <h2 id="virtual-assistant-title" className="va__title">
                Virtual Assistant
              </h2>
              <p className="va__meta" aria-live="polite">
                Session: {sessionId || 'Preparing session...'}
              </p>
            </div>
            <div className="va__actions" role="group" aria-label="Conversation actions">
              <button
                type="button"
                className="va__control"
                onClick={saveTranscript}
                disabled={!canSaveTranscript}
              >
                Save Transcript
              </button>
              <button
                type="button"
                className="va__control va__control--danger"
                onClick={onEndConversation}
                disabled={isEnding}
              >
                End Conversation
              </button>
              <button
                type="button"
                className="va__control"
                onClick={toggleMinimize}
                aria-label="Minimize virtual assistant"
              >
                Minimize
              </button>
            </div>
          </header>

          <div className="va__status" role="status" aria-live="polite">
            {assistantStatusText}
          </div>

          <ol ref={listRef} className="va__messages" aria-label="Conversation transcript">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`va__message va__message--${message.role}`}
              >
                <span className="va__message-role">{message.role}</span>
                <p className="va__message-content">{message.content}</p>
              </li>
            ))}

            {isLoading ? (
              <li className="va__message va__message--assistant" aria-live="polite">
                <span className="va__message-role">assistant</span>
                <p className="va__message-content">Thinking...</p>
              </li>
            ) : null}
          </ol>

          {error ? (
            <div className="va__error" role="alert">
              {error}
            </div>
          ) : null}

          <form className="va__composer" onSubmit={onSubmit}>
            <label htmlFor="virtual-assistant-input" className="va__label">
              Ask a question
            </label>
            <textarea
              id="virtual-assistant-input"
              ref={inputRef}
              className="va__input"
              rows={2}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Type your message. Press Enter to send, Shift+Enter for a new line."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="va__send"
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      ) :  <button
        type="button"
        className="va__launcher"
        onClick={toggleMinimize}
        aria-expanded={!isMinimized}
        aria-controls="virtual-assistant-panel"
      >
        {isMinimized ? 'Open Assistant' : 'Minimize Assistant'}
      </button>}
    </section>
  );
};

export default VirtualAssistant;
