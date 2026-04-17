const express = require('express');
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Get all categories for the logged-in user
router.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { user_id: req.userId }
  });
  res.json(categories);
});

// Create a new category
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const category = await prisma.category.create({
    data: { name, user_id: req.userId }
  });

  res.status(201).json(category);
});

module.exports = router;
