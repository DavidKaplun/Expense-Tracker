const express = require('express');
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const authMiddleware = require('../middleware/auth');
const prisma = require('../prismaClient');

const MONTHLY_LIMIT = 5;

const router = express.Router();
router.use(authMiddleware);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/extract', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const usage = await prisma.invoiceUsage.upsert({
      where: { user_id_year_month: { user_id: req.userId, year, month } },
      update: {},
      create: { user_id: req.userId, year, month, count: 0 },
    });

    if (usage.count >= MONTHLY_LIMIT) {
      return res.status(429).json({ error: `Monthly limit of ${MONTHLY_LIMIT} invoice scans reached. Resets next month.` });
    }

    const { mimetype, buffer } = req.file;
    const base64 = buffer.toString('base64');
    const isPdf = mimetype === 'application/pdf';

    const content = isPdf
      ? [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
          { type: 'text', text: 'This is a receipt or invoice. Extract the following fields and return ONLY valid JSON with no explanation: { "description": "short description of what was purchased (max 50 chars)", "amount": number, "date": "YYYY-MM-DD", "category": "one of: Food, Housing, Transport, Shopping, Hobbies, Subscriptions, Health, Education, or Other" }. If a field cannot be determined, use null.' },
        ]
      : [
          { type: 'image', source: { type: 'base64', media_type: mimetype, data: base64 } },
          { type: 'text', text: 'This is a receipt or invoice. Extract the following fields and return ONLY valid JSON with no explanation: { "description": "short description of what was purchased (max 50 chars)", "amount": number, "date": "YYYY-MM-DD", "category": "one of: Food, Housing, Transport, Shopping, Hobbies, Subscriptions, Health, Education, or Other" }. If a field cannot be determined, use null.' },
        ];

    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 256,
      messages: [{ role: 'user', content }],
    });

    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(422).json({ error: 'Could not extract data from file' });

    const extracted = JSON.parse(jsonMatch[0]);

    await prisma.invoiceUsage.update({
      where: { user_id_year_month: { user_id: req.userId, year, month } },
      data: { count: { increment: 1 } },
    });

    res.json({ ...extracted, scansUsed: usage.count + 1, scansLimit: MONTHLY_LIMIT });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to extract invoice data' });
  }
});

module.exports = router;
