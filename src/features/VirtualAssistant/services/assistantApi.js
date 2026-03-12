const ASSISTANT_ENDPOINT =
  import.meta.env.VITE_ASSISTANT_API_URL || '/api/assistant/chat';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

const normalizeAssistantText = (responseBody) => {
  if (!responseBody) {
    return '';
  }

  if (typeof responseBody === 'string') {
    return responseBody.trim();
  }

  const candidate =
    responseBody.answer ||
    responseBody.reply ||
    responseBody.message ||
    responseBody.text ||
    (Array.isArray(responseBody.choices)
      ? responseBody.choices[0]?.message?.content
      : '');

  return typeof candidate === 'string' ? candidate.trim() : '';
};

export const sendAssistantMessage = async ({
  sessionId,
  prompt,
  history = [],
  signal,
}) => {
  const response = await fetch(ASSISTANT_ENDPOINT, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    signal,
    body: JSON.stringify({
      sessionId,
      prompt,
      history,
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    const message =
      data?.error || data?.message || response.statusText || fallback;
    throw new Error(message);
  }

  const text = normalizeAssistantText(data);
  if (!text) {
    throw new Error('Assistant response was empty. Please try again.');
  }

  return {
    text,
    raw: data,
  };
};
