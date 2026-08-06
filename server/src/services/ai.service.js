const Event = require('../models/Event');
const Task = require('../models/Task');
const User = require('../models/User');

const fallbackEvents = [
  { id: 'ev-1', title: 'AI & ML Innovations Summit 2026', category: 'Artificial Intelligence', date: 'Today, Aug 4', location: 'Pune Tech Park / Hybrid', attendees: 420, price: 0, isFree: true },
  { id: 'ev-2', title: 'Global Hackathon & Code Sprint', category: 'Hackathons', date: 'Aug 6 - Aug 8', location: 'Main Tech Hub, Stage A', attendees: 280, price: 0, isFree: true },
  { id: 'ev-3', title: 'Cyber Security & Zero Trust Workshop', category: 'Cyber Security', date: 'Aug 14', location: 'Convention Center Lab 2', attendees: 115, price: 25, isFree: false },
];

/**
 * Builds live data context from database or cached fallback events
 */
const getLiveEventContext = async () => {
  try {
    let events = [];
    try {
      events = await Event.find().limit(10).lean();
    } catch (e) {
      events = fallbackEvents;
    }
    if (!events || events.length === 0) events = fallbackEvents;

    const eventList = events.map(e => `- "${e.title}" (${e.category || 'General'}): Date: ${e.date || 'TBD'}, Venue: ${e.location || 'Online'}, Registered Attendees: ${e.attendees || e.registeredCount || 0}, Seats Left: ${500 - (e.attendees || 0)}, Price: ${e.isFree || e.price === 0 ? 'Free' : '$' + e.price}`).join('\n');

    return `\n\n[LIVE PLATFORM EVENT DATA CONTEXT]:\n${eventList}\nUse this real data context to answer queries accurately regarding events, dates, capacity, fees, and venues.`;
  } catch (err) {
    return '';
  }
};

const callAI = async ({ prompt, systemPrompt, provider, model, apiKey }) => {
  const selectedProvider = provider || process.env.AI_PROVIDER || 'pollinations';
  const liveContext = await getLiveEventContext();
  const sys = (systemPrompt || 'You are Anjaneya AI, an intelligent event and volunteer management platform assistant.') + liveContext;

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
  getLiveEventContext,
};
