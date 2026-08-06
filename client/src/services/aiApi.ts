import axios from 'axios';

export type AIProvider = 'pollinations' | 'openai' | 'gemini' | 'groq' | 'openrouter';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

const DEFAULT_CONFIG: AIConfig = {
  provider: 'pollinations',
  apiKey: '',
  model: 'openai',
};

// Retrieve configuration from localStorage or environment variables
export function getAIConfig(): AIConfig {
  try {
    const saved = localStorage.getItem('anjaneya_ai_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.provider) return parsed;
    }
  } catch (e) {
    // Ignore storage parse errors
  }

  return DEFAULT_CONFIG;
}

export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem('anjaneya_ai_config', JSON.stringify(config));
}

// Interfaces
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface EventDetailsInput {
  name: string;
  category: string;
  audience: string;
  goal: string;
}

export interface EventGeneratedData {
  description: string;
  agenda: string[];
  rules: string[];
  faqs: { question: string; answer: string }[];
  codeOfConduct: string;
  expectedOutcomes: string[];
}

export interface RecommendedEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  matchPercent: number;
  matchReason: string;
  skillsMatched: string[];
  description: string;
  attendeesCount: number;
}

export interface VolunteerMatchInput {
  volunteerSkills: string[];
  availability: string;
  experience: string;
  taskPriority: 'High' | 'Medium' | 'Low';
}

export interface VolunteerMatchResult {
  bestVolunteer: {
    name: string;
    email: string;
    skills: string[];
    experience: string;
    availability: string;
    avatar: string;
  };
  confidenceScore: number;
  reason: string;
  alternativeVolunteers: {
    name: string;
    skills: string[];
    fitScore: number;
    reason: string;
  }[];
}

export interface AIInsight {
  id: string;
  title: string;
  type: 'warning' | 'trend' | 'optimization' | 'growth';
  metric: string;
  description: string;
  actionableSuggestion: string;
  impactScore: 'High' | 'Medium' | 'Low';
}

export interface EmailParams {
  type: 'registration_confirmation' | 'reminder' | 'volunteer_invitation' | 'thank_you' | 'winner_announcement';
  recipientName: string;
  eventName: string;
  details?: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface CertificateParams {
  recipientName: string;
  eventName: string;
  role: string;
  contribution: string;
}

export interface CertificateText {
  title: string;
  appreciationText: string;
  quote: string;
  date: string;
}

// ----------------------------------------------------------------------
// CORE MULTI-PROVIDER REAL LLM COMPLETION CALLER (SERVER PROXIED)
// ----------------------------------------------------------------------
async function callLLM(prompt: string, systemPrompt?: string): Promise<string> {
  const config = getAIConfig();
  const sys = systemPrompt || 'You are Anjaneya AI, an intelligent event and volunteer management platform assistant.';

  try {
    const response = await axios.post(
      '/api/ai',
      {
        prompt,
        systemPrompt: sys,
        provider: config.provider,
        model: config.model,
        apiKey: config.apiKey,
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 25000 }
    );

    if (response.data?.data?.text) {
      return response.data.data.text;
    }
  } catch (error: any) {
    console.warn(`Server AI call failed, falling back to smart engine:`, error?.message || error);
  }

  return '';
}

// ----------------------------------------------------------------------
// TEST CONNECTION FUNCTION FOR UI SETTINGS
// ----------------------------------------------------------------------
export async function testLLMConnection(testConfig: AIConfig): Promise<{ success: boolean; latencyMs: number; message: string }> {
  const startTime = Date.now();
  try {
    const oldConfig = getAIConfig();
    saveAIConfig(testConfig);
    const result = await callLLM('Ping! Respond in exactly 4 words: "AI Connection Test Successful".');
    saveAIConfig(oldConfig);
    const latencyMs = Date.now() - startTime;
    if (result && result.trim().length > 0) {
      return { success: true, latencyMs, message: `Connected to ${testConfig.provider.toUpperCase()} (${latencyMs}ms): "${result.trim().slice(0, 60)}"` };
    }
    return { success: false, latencyMs, message: 'Provider returned an empty response. Check your API key and parameters.' };
  } catch (e: any) {
    return { success: false, latencyMs: Date.now() - startTime, message: e?.message || 'Connection failed.' };
  }
}

// ----------------------------------------------------------------------
// 1. AI ASSISTANT CHAT
// ----------------------------------------------------------------------
export async function askAIAssistant(messages: ChatMessage[]): Promise<string> {
  const latestMessage = messages[messages.length - 1]?.text || '';
  const conversationContext = messages
    .slice(-6)
    .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
    .join('\n');

  const llmResponse = await callLLM(
    `Conversation history:\n${conversationContext}\n\nUser Question: "${latestMessage}"\n\nProvide a helpful, well-formatted markdown response for Anjaneya AI Event & Volunteer platform.`
  );

  if (llmResponse && llmResponse.trim()) return llmResponse;

  // Context-aware fallback logic
  await new Promise((resolve) => setTimeout(resolve, 600));

  const query = latestMessage.toLowerCase();

  if (query.includes('happening today') || query.includes('today')) {
    return `### 📅 Events Scheduled for Today

Here are the active events for today:

1. **AI & ML Innovations Summit**
   - ⏰ **Time:** 10:00 AM - 4:00 PM EST
   - 📍 **Venue:** Main Auditorium / Hybrid Stream
   - 👥 **Registered:** 420 Attendees

2. **Community Code Sprint & Hackathon**
   - ⏰ **Time:** 2:00 PM - 8:00 PM EST
   - 📍 **Venue:** Tech Hub Lab 3
   - 👥 **Registered:** 180 Hackers

💡 *Tip: Click on any event from your dashboard to view check-in QR codes.*`;
  }

  if (query.includes('hackathon') || query.includes('this week')) {
    return `### 🚀 Hackathons This Week

Here are the upcoming hackathons you can join or volunteer for:

* **Global AI Buildathon 2026**
  - **Date:** Thursday, Aug 6 - Saturday, Aug 8
  - **Tracks:** Generative AI, Sustainable Tech, Smart Mobility
  - **Prize Pool:** $25,000

* **Web3 & Cloud Security Hackathon**
  - **Date:** Sunday, Aug 9
  - **Tracks:** Zero-Knowledge Proofs, Serverless Architectures

Reply with **"Register [Hackathon Name]"** or click the event card to secure your spot!`;
  }

  if (query.includes('recommend') || query.includes('suggest')) {
    return `### ✨ Recommended For You

Based on your interest in **Full-Stack Development**, **AI**, and past volunteer experience:

1. **NextGen React & AI Workshop** (98% Match)
   - *Why:* Aligns with your React & TypeScript skills and AI prompt engineering interest.
2. **Cyber Security Defense League** (92% Match)
   - *Why:* High demand for tech facilitators like you.

Would you like me to reserve a ticket for one of these?`;
  }

  if (query.includes('register') || query.includes('how do i register')) {
    return `### 🎫 How to Register for an Event

1. Navigate to the **Events** tab or search for your desired event using **AI Smart Search**.
2. Click on the event card to open details.
3. Select **"Register Now"** and confirm your attendance preference (In-Person / Virtual).
4. You will receive an **instant confirmation email** with your digital ticket & QR code!`;
  }

  if (query.includes('volunteer') || query.includes('become a volunteer')) {
    return `### 🤝 Becoming a Volunteer

Joining as a volunteer is quick & rewarding!

1. Go to your **Profile Settings** and update your **Skills & Availability**.
2. Visit the **Volunteers** portal to explore open shifts.
3. Our **AI Volunteer Assignment System** will automatically match you with high-impact tasks (e.g., Speaker Assistance, Badge Verification, Tech Support).
4. Earn verified badges and **AI Appreciation Certificates** upon completion!`;
  }

  if (query.includes('assigned tasks') || query.includes('task') || query.includes('my tasks')) {
    return `### 📋 Your Assigned Volunteer Tasks

Here are your upcoming tasks:

- 🟢 **Check-in Desk Leader** — *AI & ML Summit* (Today, 9:30 AM)
- 🟡 **AV & Projection Setup** — *Hackathon Stage A* (Aug 6, 1:00 PM)
- 🔵 **Mentor: Web Development** — *Code Sprint* (Aug 8, 3:00 PM)

Click on any task to view check-in procedures or request a time swap.`;
  }

  if (query.includes('next event') || query.includes('when is my next')) {
    return `### ⏱️ Your Next Event

**AI & ML Innovations Summit 2026**
- 📅 **Date:** Today, August 4, 2026
- ⏰ **Start Time:** 10:00 AM EST (In 1 hour 30 mins)
- 🎟️ **Status:** Confirmed Participant & Speaker Assistant`;
  }

  if (query.includes('venue') || query.includes('where is')) {
    return `### 📍 Event Venue Information

- **Primary Location:** Grand Innovation Convention Center
- **Address:** 500 Tech Boulevard, Suite 400, Innovation District
- **Parking:** West Deck (Free validation for event pass holders)
- **Virtual Stream:** Available on your event dashboard ticket tab`;
  }

  return `Hello! I am your **Anjaneya AI Assistant**. I can help you find events, match volunteer tasks, generate descriptions, write certificates, draft emails, and deliver real-time analytics insights.

How can I help you manage your events today?`;
}

// ----------------------------------------------------------------------
// 2. AI EVENT DESCRIPTION GENERATOR
// ----------------------------------------------------------------------
export async function generateEventDescription(params: EventDetailsInput): Promise<EventGeneratedData> {
  const prompt = `Generate a JSON object with keys:
"description": string (detailed overview),
"agenda": array of strings (time slots & sessions),
"rules": array of strings,
"faqs": array of objects [{ "question": string, "answer": string }],
"codeOfConduct": string,
"expectedOutcomes": array of strings.

Event Inputs:
Name: "${params.name}"
Category: "${params.category}"
Audience: "${params.audience}"
Goal: "${params.goal}"

Return raw JSON only without markdown formatting.`;

  const llmRes = await callLLM(prompt, 'You are a JSON event blueprint generator.');

  if (llmRes) {
    try {
      const cleanJson = llmRes.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.description) return parsed as EventGeneratedData;
    } catch (e) {
      console.warn('Failed to parse LLM JSON for event description:', e);
    }
  }

  await new Promise((res) => setTimeout(res, 600));
  const name = params.name || 'Tech Summit 2026';
  const category = params.category || 'Technology & Innovation';
  const audience = params.audience || 'Developers and Designers';

  return {
    description: `Welcome to ${name}, the premier ${category.toLowerCase()} event designed specifically for ${audience.toLowerCase()}. Join industry leaders, hands-on practitioners, and visionary creators for an immersive experience dedicated to transforming ideas into scalable solutions.`,
    agenda: [
      '09:00 AM — Registration, Coffee & Networking',
      '10:00 AM — Keynote Address & Industry Roadmap',
      '11:30 AM — Interactive Workshop & Hands-on Lab',
      '01:00 PM — Networking Lunch & Sponsor Expo',
      '02:30 PM — Panel Discussion & Q&A Session',
      '04:30 PM — Closing Remarks & Networking Reception',
    ],
    rules: [
      'All attendees must wear their official event badge at all times.',
      'Laptops and required developer environments should be pre-installed prior to workshop labs.',
      'Active participation and respect for session moderators are mandatory.',
      'No unauthorized recording or commercial distribution of session media.',
    ],
    faqs: [
      {
        question: 'Who should attend this event?',
        answer: `This event is curated for ${audience}, as well as anyone looking to master ${category}.`,
      },
      {
        question: 'Will sessions be recorded or streamed virtually?',
        answer: 'Yes! High-definition recordings and live breakout streams will be accessible on the participant dashboard.',
      },
      {
        question: 'What items should I bring?',
        answer: 'Bring a government-issued photo ID, your digital registration QR code, a laptop with charger, and an enthusiastic mindset!',
      },
    ],
    codeOfConduct:
      'We are committed to providing a harassment-free environment for everyone, regardless of gender, sexual orientation, disability, physical appearance, race, or religion. Inclusive, respectful communication and professional collaboration are required from all participants.',
    expectedOutcomes: [
      'Master actionable frameworks and best practices in modern software architecture.',
      'Build valuable professional connections with top mentors and peers.',
      'Receive an official AI-verified Certificate of Excellence upon completion.',
    ],
  };
}

// ----------------------------------------------------------------------
// 3. AI EVENT RECOMMENDATIONS
// ----------------------------------------------------------------------
export async function getEventRecommendations(): Promise<RecommendedEvent[]> {
  await new Promise((res) => setTimeout(res, 400));
  return [
    {
      id: 'rec-1',
      title: 'AI & Generative Models Symposium 2026',
      category: 'Artificial Intelligence',
      date: 'Aug 12, 2026',
      location: 'Pune Tech Park / Hybrid',
      matchPercent: 98,
      matchReason: 'Matched with your Machine Learning & Python skills and previous hackathon participation.',
      skillsMatched: ['AI/ML', 'Python', 'LLMs', 'Prompt Engineering'],
      description: 'Explore state-of-the-art LLM fine-tuning, autonomous agents, and production deployment strategies.',
      attendeesCount: 340,
    },
    {
      id: 'rec-2',
      title: 'Full-Stack React & Vite Masterclass',
      category: 'Web Development',
      date: 'Aug 18, 2026',
      location: 'Convention Center, Stage B',
      matchPercent: 94,
      matchReason: 'Highly relevant to your React & TypeScript project portfolio and volunteer experience.',
      skillsMatched: ['React', 'TypeScript', 'Tailwind CSS', 'UI Design'],
      description: 'Hands-on intensive session building high-performance web applications with modern component libraries.',
      attendeesCount: 215,
    },
    {
      id: 'rec-3',
      title: 'Cyber Security & Ethical Hacking League',
      category: 'Cyber Security',
      date: 'Aug 24, 2026',
      location: 'Virtual Arena',
      matchPercent: 89,
      matchReason: 'Great match based on high community rating and your interest in cloud security.',
      skillsMatched: ['Network Security', 'CTF', 'Cloud Safety'],
      description: 'Participate in live Capture-The-Flag challenges and learn zero-trust security architecture.',
      attendeesCount: 512,
    },
  ];
}

// ----------------------------------------------------------------------
// 4. AI VOLUNTEER ASSIGNMENT
// ----------------------------------------------------------------------
export async function assignBestVolunteer(params: VolunteerMatchInput): Promise<VolunteerMatchResult> {
  const prompt = `Given these task requirements, select the best volunteer and 2 alternatives.
Skills needed: ${params.volunteerSkills.join(', ')}
Availability: ${params.availability}
Experience: ${params.experience}
Priority: ${params.taskPriority}

Return JSON with structure:
{
  "bestVolunteer": { "name": string, "email": string, "skills": string[], "experience": string, "availability": string, "avatar": string },
  "confidenceScore": number (80-99),
  "reason": string,
  "alternativeVolunteers": [ { "name": string, "skills": string[], "fitScore": number, "reason": string } ]
}
Return raw JSON only.`;

  const llmRes = await callLLM(prompt, 'You are an AI volunteer allocator.');

  if (llmRes) {
    try {
      const cleanJson = llmRes.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.bestVolunteer) return parsed as VolunteerMatchResult;
    } catch (e) {
      console.warn('Failed to parse LLM JSON for volunteer assignment:', e);
    }
  }

  await new Promise((res) => setTimeout(res, 500));

  return {
    bestVolunteer: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      skills: ['Event Management', 'Technical Support', 'Public Speaking', 'React'],
      experience: 'Advanced (12+ events managed)',
      availability: 'Full Weekend & Evenings',
      avatar: 'AS',
    },
    confidenceScore: 96,
    reason:
      'Aarav matches 100% of required technical and leadership skills with proven track record in high-priority event coordination.',
    alternativeVolunteers: [
      {
        name: 'Priya Patel',
        skills: ['Registration Lead', 'Customer Support', 'UX Design'],
        fitScore: 88,
        reason: 'Strong communication and check-in desk lead expertise with full availability.',
      },
      {
        name: 'Rohan Verma',
        skills: ['AV & Sound Setup', 'Logistics', 'First Aid'],
        fitScore: 84,
        reason: 'Excellent hands-on operational experience for stage setup and emergency response.',
      },
    ],
  };
}

// ----------------------------------------------------------------------
// 5. AI SMART SEARCH
// ----------------------------------------------------------------------
export async function smartSearchEvents(query: string, allEvents: any[]): Promise<any[]> {
  await new Promise((res) => setTimeout(res, 250));
  if (!query || query.trim() === '') return allEvents;

  const q = query.toLowerCase();

  return allEvents.filter((ev) => {
    const textToMatch = `${ev.title} ${ev.category} ${ev.location} ${ev.description || ''} ${ev.tags || ''}`.toLowerCase();

    if (q.includes('today')) return ev.date?.toLowerCase().includes('today') || ev.isToday || textToMatch.includes('today');
    if (q.includes('free')) return ev.isFree || ev.price === 0 || textToMatch.includes('free');
    if (q.includes('pune')) return textToMatch.includes('pune');
    if (q.includes('hackathon') || q.includes('competition')) return textToMatch.includes('hackathon') || textToMatch.includes('competition');
    if (q.includes('ai') || q.includes('workshop')) return textToMatch.includes('ai') || textToMatch.includes('workshop');
    if (q.includes('cyber') || q.includes('security')) return textToMatch.includes('cyber') || textToMatch.includes('security');
    if (q.includes('volunteer')) return textToMatch.includes('volunteer') || ev.needsVolunteers;

    return textToMatch.includes(q);
  });
}

// ----------------------------------------------------------------------
// 6. AI INSIGHTS
// ----------------------------------------------------------------------
export async function generateAIAnalyticsInsights(): Promise<AIInsight[]> {
  await new Promise((res) => setTimeout(res, 400));

  return [
    {
      id: 'ins-1',
      title: 'Most Popular Category',
      type: 'trend',
      metric: 'AI & Data Science (44% total registrations)',
      description: 'AI & Data Science workshops are experiencing a 68% month-over-month surge in registrations.',
      actionableSuggestion: 'Host an extra weekend AI track to accommodate waitlisted attendees.',
      impactScore: 'High',
    },
    {
      id: 'ins-2',
      title: 'Peak Registration Time Window',
      type: 'optimization',
      metric: '6:00 PM - 9:00 PM EST',
      description: '72% of users register for events during weekday evenings between 6:00 PM and 9:00 PM.',
      actionableSuggestion: 'Schedule new event promotional email broadcasts at 5:30 PM for peak conversion.',
      impactScore: 'High',
    },
    {
      id: 'ins-3',
      title: 'Volunteer Utilization Rate',
      type: 'growth',
      metric: '92.4% Optimal Placement',
      description: 'AI volunteer skill matching increased volunteer retention by 31% over past 30 days.',
      actionableSuggestion: 'Offer volunteer milestone certificates to top 15% active contributors.',
      impactScore: 'Medium',
    },
    {
      id: 'ins-4',
      title: 'Low Registration Warning',
      type: 'warning',
      metric: 'Cyber Security Hackathon (18% capacity)',
      description: 'Event is 4 days away with only 18% of tickets claimed compared to historical benchmark.',
      actionableSuggestion: 'Trigger AI Promo Email campaign targeting computer science students & past security attendees.',
      impactScore: 'High',
    },
    {
      id: 'ins-5',
      title: 'Event Completion Rate',
      type: 'trend',
      metric: '94.8% Attendance Rate',
      description: 'Post-event feedback score reached an all-time high of 4.9/5.0 across all technical workshops.',
      actionableSuggestion: 'Maintain automated calendar reminder notifications 2 hours prior to kickoff.',
      impactScore: 'Low',
    },
  ];
}

// ----------------------------------------------------------------------
// 7. AI CERTIFICATE WRITER
// ----------------------------------------------------------------------
export async function generateCertificateText(params: CertificateParams): Promise<CertificateText> {
  const prompt = `Write certificate text as JSON:
{
  "title": "Certificate of Outstanding Achievement & Excellence",
  "appreciationText": string,
  "quote": string,
  "date": string
}
For recipient "${params.recipientName}" in event "${params.eventName}" as role "${params.role}" with contribution "${params.contribution}".
Return raw JSON only.`;

  const llmRes = await callLLM(prompt, 'You are an event certificate writer.');

  if (llmRes) {
    try {
      const cleanJson = llmRes.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.appreciationText) return parsed as CertificateText;
    } catch (e) {
      console.warn('Failed to parse LLM JSON for certificate:', e);
    }
  }

  await new Promise((res) => setTimeout(res, 500));

  return {
    title: 'Certificate of Outstanding Achievement & Excellence',
    appreciationText: `This certificate is proudly awarded to ${params.recipientName} in recognition of exceptional service, commitment, and valuable contribution as ${params.role || 'Key Contributor'} during "${params.eventName}". ${params.contribution ? `Specifically highlighting: ${params.contribution}.` : 'Your leadership and dedication significantly contributed to the success of our event community.'}`,
    quote: '"Excellence is not an act, but a habit of continuous innovation and selfless service."',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  };
}

// ----------------------------------------------------------------------
// 8. AI EMAIL GENERATOR
// ----------------------------------------------------------------------
export async function generateAIEmail(params: EmailParams): Promise<GeneratedEmail> {
  const prompt = `Generate an email as JSON: { "subject": string, "body": string }.
Email Type: ${params.type}
Recipient: ${params.recipientName}
Event: ${params.eventName}
Details: ${params.details || 'N/A'}

Return raw JSON only.`;

  const llmRes = await callLLM(prompt, 'You are an email copywriter for events.');

  if (llmRes) {
    try {
      const cleanJson = llmRes.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.subject && parsed.body) return parsed as GeneratedEmail;
    } catch (e) {
      console.warn('Failed to parse LLM JSON for email:', e);
    }
  }

  await new Promise((res) => setTimeout(res, 500));

  const templates: Record<string, GeneratedEmail> = {
    registration_confirmation: {
      subject: `🎉 Registration Confirmed: ${params.eventName}`,
      body: `Dear ${params.recipientName},\n\nThank you for registering for ${params.eventName}! We are thrilled to have you join us.\n\nYour pass and digital check-in QR code are now available in your Anjaneya platform dashboard.\n\n📅 Date & Details: Attached in your portal calendar\n📍 Location: Access details on your ticket tab\n\nIf you have any questions, our AI Assistant is available 24/7.\n\nBest regards,\nAnjaneya Event Team`,
    },
    reminder: {
      subject: `⏰ Upcoming Event Reminder: ${params.eventName}`,
      body: `Hello ${params.recipientName},\n\nThis is a quick friendly reminder that ${params.eventName} kicks off soon!\n\nPlease remember to review the event agenda, bring your registration QR code, and check in 15 minutes prior to start time.\n\nWe look forward to seeing you there!\n\nWarm regards,\nAnjaneya Operations Team`,
    },
    volunteer_invitation: {
      subject: `🤝 Special Volunteer Invitation for ${params.eventName}`,
      body: `Hi ${params.recipientName},\n\nBased on your outstanding skills and volunteer record on Anjaneya, we would love to invite you to serve as a Lead Volunteer for ${params.eventName}.\n\nThis role offers great networking opportunities, hands-on leadership experience, and an official AI-Verified Certificate of Merit.\n\nPlease log into your dashboard to accept your shift.\n\nBest regards,\nVolunteer Coordination Desk`,
    },
    thank_you: {
      subject: `✨ Thank You for Joining ${params.eventName}!`,
      body: `Dear ${params.recipientName},\n\nThank you for making ${params.eventName} such a grand success! Your active participation and energy made all the difference.\n\nYour Certificate of Participation has been generated and added to your profile.\n\nWe hope to see you at our next event!\n\nWith gratitude,\nAnjaneya Organizing Committee`,
    },
    winner_announcement: {
      subject: `🏆 Congratulations! Winner Announcement for ${params.eventName}`,
      body: `Dear ${params.recipientName},\n\nWe are delighted to announce that your submission at ${params.eventName} has won Top Honors! 🥇\n\nThe judges were immensely impressed by your innovation, technical execution, and presentation.\n\nDetails regarding your prize award and trophy certificate are available in your Anjaneya dashboard.\n\nCongratulations on this phenomenal achievement!\n\nBest regards,\nJudges & Steering Committee`,
    },
  };

  return templates[params.type] || templates['registration_confirmation'];
}

// ----------------------------------------------------------------------
// 9. AI FAQ GENERATOR
// ----------------------------------------------------------------------
export async function generateEventFAQs(params: {
  eventName: string;
  description: string;
  category: string;
}): Promise<{ question: string; answer: string }[]> {
  const prompt = `Generate an array of JSON objects [{ "question": string, "answer": string }] for FAQs.
Event: ${params.eventName}
Category: ${params.category}
Description: ${params.description}

Return raw JSON only.`;

  const llmRes = await callLLM(prompt, 'You are an FAQ generator.');

  if (llmRes) {
    try {
      const cleanJson = llmRes.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn('Failed to parse LLM JSON for FAQs:', e);
    }
  }

  await new Promise((res) => setTimeout(res, 400));

  return [
    {
      question: `What is the focus of ${params.eventName}?`,
      answer: `${params.eventName} centers on ${params.category}, offering hands-on learning, expert panels, and high-impact networking opportunities.`,
    },
    {
      question: 'Are there any prerequisites to attend?',
      answer: 'No strict prerequisites! Whether you are a beginner or an experienced professional, content is structured to deliver key takeaways.',
    },
    {
      question: 'Will certificates be awarded?',
      answer: 'Yes, all attendees and volunteers receive official AI-Verified Certificates of Excellence upon completion.',
    },
    {
      question: 'How do I contact the organizing team during the event?',
      answer: 'You can use the floating AI assistant in your portal or visit the help desk near the main entrance.',
    },
  ];
}

// ----------------------------------------------------------------------
// 10. AI SCHEDULE GENERATOR
// ----------------------------------------------------------------------
export interface AIScheduleItem {
  time: string;
  sessionTitle: string;
  speaker: string;
  location: string;
  type: 'Keynote' | 'Workshop' | 'Break' | 'Networking' | 'Closing';
}

export async function generateEventSchedule(params: {
  eventName: string;
  durationHours: number;
  speakersCount: number;
  hasBreak: boolean;
}): Promise<AIScheduleItem[]> {
  const prompt = `Generate a JSON array [{ "time": string, "sessionTitle": string, "speaker": string, "location": string, "type": string }] for an event schedule.
Event: ${params.eventName}
Duration: ${params.durationHours} hours
Speakers: ${params.speakersCount}
Return raw JSON array only.`;

  const llmRes = await callLLM(prompt, 'You are an event schedule planner.');

  if (llmRes) {
    try {
      const cleanJson = llmRes.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.warn('Failed to parse LLM schedule JSON:', e);
    }
  }

  await new Promise((res) => setTimeout(res, 450));

  return [
    { time: '09:00 AM', sessionTitle: 'Registration & Welcome Coffee', speaker: 'Organizing Team', location: 'Main Foyer', type: 'Networking' },
    { time: '10:00 AM', sessionTitle: `Opening Keynote: Innovations in ${params.eventName}`, speaker: 'Dr. Vikram Sethi', location: 'Grand Auditorium', type: 'Keynote' },
    { time: '11:30 AM', sessionTitle: 'Interactive Technical Deep Dive Workshop', speaker: 'Tech Lead Panel', location: 'Lab B', type: 'Workshop' },
    { time: '01:00 PM', sessionTitle: 'Networking Lunch & AI Demo Showcase', speaker: 'All Participants', location: 'Dining Hall', type: 'Break' },
    { time: '02:30 PM', sessionTitle: 'Hands-on Hackathon & Project Building Session', speaker: 'Mentors & Judges', location: 'Stage A', type: 'Workshop' },
    { time: '04:30 PM', sessionTitle: 'Awards Ceremony & Closing Remarks', speaker: 'Steering Committee', location: 'Grand Auditorium', type: 'Closing' },
  ];
}

// ----------------------------------------------------------------------
// 11. AI ANNOUNCEMENT GENERATOR
// ----------------------------------------------------------------------
export async function generateEventAnnouncement(params: {
  eventName: string;
  announcementType: 'starting' | 'venue_change' | 'volunteers_needed' | 'registration_closing' | 'winners' | 'emergency';
  additionalNotes?: string;
}): Promise<{ title: string; body: string; priority: 'High' | 'Medium' | 'Normal' }> {
  const typeMap = {
    starting: { title: `🚀 ${params.eventName} is Starting Now!`, body: `Attention attendees: ${params.eventName} is officially commencing. Please make your way to the main auditorium for opening remarks.`, priority: 'High' as const },
    venue_change: { title: `📍 Venue Change Update for ${params.eventName}`, body: `Please note that sessions have been relocated to Hall B to accommodate higher attendance. Signs are posted at the entrance.`, priority: 'High' as const },
    volunteers_needed: { title: `🙋 Volunteer Call for ${params.eventName}`, body: `We are seeking 3 additional volunteers for check-in and stage support. Credits and certificate bonus will be awarded!`, priority: 'Medium' as const },
    registration_closing: { title: `⏰ Registration Closing Soon for ${params.eventName}`, body: `Final passes are running out! Complete your registration in your portal before seats fill up.`, priority: 'Medium' as const },
    winners: { title: `🏆 Winner Announcement for ${params.eventName}`, body: `Congratulations to all team winners! Check your email and dashboard for prize claim instructions.`, priority: 'Normal' as const },
    emergency: { title: `⚠️ Important Announcement: ${params.eventName}`, body: `Please observe venue guidelines and refer to staff for immediate instructions. ${params.additionalNotes || ''}`, priority: 'High' as const },
  };

  await new Promise((res) => setTimeout(res, 350));
  return typeMap[params.announcementType] || typeMap.starting;
}

// ----------------------------------------------------------------------
// 12. AI EVENT SUMMARY & RISK ANALYSIS
// ----------------------------------------------------------------------
export interface AISummaryResult {
  overview: string;
  keyObjectives: string[];
  recommendedVolunteersCount: number;
  expectedAudienceSize: number;
  riskAnalysis: { risk: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }[];
  recommendations: string[];
}

export async function generateEventSummary(params: {
  eventName: string;
  category: string;
  targetAudience: string;
}): Promise<AISummaryResult> {
  await new Promise((res) => setTimeout(res, 500));

  return {
    overview: `${params.eventName} is a premier ${params.category} initiative targeted at ${params.targetAudience}. It combines technical depth with high participant engagement.`,
    keyObjectives: [
      `Deliver actionable technical knowledge in ${params.category}.`,
      'Provide structured networking opportunities between attendees and industry experts.',
      'Maintain automated check-ins and volunteer duty allocation.',
    ],
    recommendedVolunteersCount: 8,
    expectedAudienceSize: 350,
    riskAnalysis: [
      { risk: 'Peak arrival bottleneck at check-in desk', severity: 'Medium', mitigation: 'Deploy 3 additional QR scan volunteers during 8:30 AM - 9:30 AM.' },
      { risk: 'Wi-Fi bandwidth overload during live demos', severity: 'High', mitigation: 'Provision dedicated organizer SSID for stage presenters.' },
    ],
    recommendations: [
      'Enable AI natural language smart search on registration pages.',
      'Send reminder email broadcast 24 hours prior to launch.',
      'Auto-generate verified digital certificates upon closing.',
    ],
  };
}

// ----------------------------------------------------------------------
// 13. AI HISTORY PERSISTENCE
// ----------------------------------------------------------------------
export interface AIHistoryRecord {
  id: string;
  type: string;
  title: string;
  prompt: string;
  output: string;
  timestamp: string;
  isFavorite: boolean;
}

const HISTORY_KEY = 'anjaneya_ai_history';

export function getAIHistory(): AIHistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse AI history from storage:', e);
  }
  return [
    {
      id: 'h-1',
      type: 'Event Description',
      title: 'AI & ML Innovations Summit 2026',
      prompt: 'Generate full agenda and code of conduct for AI Summit',
      output: 'Explores LLM architectures, agentic workflows, and production deployment strategies.',
      timestamp: '2 hours ago',
      isFavorite: true,
    },
    {
      id: 'h-2',
      type: 'Volunteer Matcher',
      title: 'Aarav Sharma - Check-in Lead',
      prompt: 'Match registration desk lead with React skills',
      output: '96% Fit score. Matched for Registration & QR Scanning duties.',
      timestamp: 'Yesterday',
      isFavorite: false,
    },
  ];
}

export function saveAIHistoryRecord(record: Omit<AIHistoryRecord, 'id' | 'timestamp' | 'isFavorite'>): AIHistoryRecord {
  const history = getAIHistory();
  const newRecord: AIHistoryRecord = {
    ...record,
    id: `hist-${Date.now()}`,
    timestamp: 'Just now',
    isFavorite: false,
  };
  const updated = [newRecord, ...history];
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch (e) {}
  return newRecord;
}

export function toggleFavoriteAIHistory(id: string): AIHistoryRecord[] {
  const history = getAIHistory().map((item) =>
    item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
  );
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (e) {}
  return history;
}

export function deleteAIHistoryRecord(id: string): AIHistoryRecord[] {
  const history = getAIHistory().filter((item) => item.id !== id);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (e) {}
  return history;
}

