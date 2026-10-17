const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Leader Agent (Claude)
async function leaderAgent(userPrompt) {
  const res = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    system: "Aap Leader AI hain. User ke task ko step-by-step plan mein breakdown karein.",
    messages: [{ role: 'user', content: userPrompt }]
  });
  return res.content[0].text;
}

// 2. Worker Agent (GPT-4o)
async function workerAgent(plan) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Aap Executor AI hain. Diye gaye plan ko execute karein.' },
      { role: 'user', content: plan }
    ]
  });
  return res.choices[0].message.content;
}

// 3. Reviewer Agent (Claude - Error Checking)
async function reviewerAgent(task, result) {
  const res = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    system: "Aap Audit AI hain. Worker ke result ko check karein. Agar koi galti hai toh 'FAIL' aur galti likhein, warna 'PASSED' likhein.",
    messages: [{ role: 'user', content: `Task: ${task}\nResult: ${result}` }]
  });
  return res.content[0].text;
}

module.exports = { leaderAgent, workerAgent, reviewerAgent };
