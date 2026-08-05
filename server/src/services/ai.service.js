const callAI = async ({ prompt, systemPrompt, provider, model, apiKey }) => {
  const selectedProvider = provider || process.env.AI_PROVIDER || 'pollinations';
  const sys = systemPrompt || 'You are Anjaneya AI, an intelligent event and volunteer management platform assistant.';

  try {
    // 1. Pollinations.ai (Free LLM engine fallback)
    if (selectedProvider === 'pollinations') {
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: prompt },
          ],
          model: model || 'openai',
          code: 'beartoken',
        }),
      });
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        if (json?.choices?.[0]?.message?.content) return json.choices[0].message.content;
      } catch (e) {
        return text;
      }
    }

    // 2. OpenAI
    if (selectedProvider === 'openai') {
      const key = apiKey || process.env.OPENAI_API_KEY;
      if (!key) throw new Error('OpenAI API Key is missing in server environment.');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    }

    // 3. Google Gemini
    if (selectedProvider === 'gemini') {
      const key = apiKey || process.env.GEMINI_API_KEY;
      if (!key) throw new Error('Gemini API Key is missing in server environment.');
      const modelName = model || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${sys}\n\n${prompt}` }],
            },
          ],
        }),
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // 4. Groq
    if (selectedProvider === 'groq') {
      const key = apiKey || process.env.GROQ_API_KEY;
      if (!key) throw new Error('Groq API Key is missing in server environment.');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    }

    // 5. OpenRouter
    if (selectedProvider === 'openrouter') {
      const key = apiKey || process.env.OPENROUTER_API_KEY;
      if (!key) throw new Error('OpenRouter API Key is missing in server environment.');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'openai/gpt-3.5-turbo',
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: prompt },
          ],
        }),
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    }
  } catch (err) {
    console.error(`[AI Service Error] ${selectedProvider}:`, err.message || err);
    throw err;
  }

  return '';
};

module.exports = {
  callAI,
};
