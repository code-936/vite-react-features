import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sendAssistantMessage } from '../services/assistantApi.js';

const STORAGE_KEY = 'virtual-assistant-session-v1';

const createSessionId = () =>
  `va-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const createMessage = ({ role, content }) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
});

const getInitialState = () => {
  const defaultState = {
    sessionId: createSessionId(),
    isMinimized: false,
    messages: [
      createMessage({
        role: 'assistant',
        content: 'Hello! I am your virtual assistant. How can I help today?',
      }),
    ],
  };

  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) {
      return defaultState;
    }

    const parsed = JSON.parse(cached);
    if (!parsed?.sessionId || !Array.isArray(parsed?.messages)) {
      return defaultState;
    }

    return {
      sessionId: parsed.sessionId,
      isMinimized: Boolean(parsed.isMinimized),
      messages: parsed.messages,
    };
  } catch {
    return defaultState;
  }
};

const toApiHistory = (messages) =>
  messages.map(({ role, content, createdAt }) => ({
    role,
    content,
    createdAt,
  }));

const useVirtualAssistant = () => {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const initialState = getInitialState();
    setSessionId(initialState.sessionId);
    setMessages(initialState.messages);
    setIsMinimized(initialState.isMinimized);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const payload = {
      sessionId,
      isMinimized,
      messages,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [sessionId, isMinimized, messages]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const saveTranscript = useCallback(() => {
    if (!messages.length) {
      return;
    }

    const transcript = messages
      .map(
        (message) =>
          `[${new Date(message.createdAt).toLocaleString()}] ${message.role.toUpperCase()}: ${message.content}`
      )
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = `assistant-transcript-${sessionId}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  }, [messages, sessionId]);

  const endConversation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const nextSessionId = createSessionId();
    const resetMessages = [
      createMessage({
        role: 'assistant',
        content:
          'New session started. Ask me anything when you are ready.',
      }),
    ];

    setSessionId(nextSessionId);
    setMessages(resetMessages);
    setIsLoading(false);
    setError('');
    setIsMinimized(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sendMessage = useCallback(
    async (input) => {
      const trimmed = input.trim();
      if (!trimmed || isLoading || !sessionId) {
        return;
      }

      const userMessage = createMessage({ role: 'user', content: trimmed });
      const optimisticMessages = [...messages, userMessage];

      setMessages(optimisticMessages);
      setError('');
      setIsLoading(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const response = await sendAssistantMessage({
          sessionId,
          prompt: trimmed,
          history: toApiHistory(optimisticMessages),
          signal: abortControllerRef.current.signal,
        });

        const assistantMessage = createMessage({
          role: 'assistant',
          content: response.text,
        });
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (caughtError) {
        if (caughtError?.name === 'AbortError') {
          return;
        }

        const errorMessage =
          caughtError?.message ||
          'The assistant is temporarily unavailable. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, sessionId]
  );

  const canSaveTranscript = useMemo(() => messages.length > 0, [messages.length]);

  return {
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
  };
};

export default useVirtualAssistant;
