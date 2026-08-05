const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const aiService = require('../services/ai.service');

const processAIRequest = asyncHandler(async (req, res) => {
  const { prompt, systemPrompt, provider, model, apiKey } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const result = await aiService.callAI({
    prompt,
    systemPrompt,
    provider,
    model,
    apiKey,
  });

  return res.json(apiResponse('AI response generated successfully', { text: result }));
});

module.exports = {
  processAIRequest,
};
