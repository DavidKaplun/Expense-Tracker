const express = require('express');
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Get all categories for the logged-in user with expense stats
router.get('/', async (req, res) => {
  try {
    const { filter } = req.query; // 'month' | 'year' | 'all'

    let dateFilter = {};
    const now = new Date();
    if (filter === 'month') {
      dateFilter = {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
        lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    } else if (filter === 'year') {
      dateFilter = {
        gte: new Date(now.getFullYear(), 0, 1),
        lte: new Date(now.getFullYear(), 11, 31),
      };
    }

    const expenseWhere = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};

    const categories = await prisma.category.findMany({
      where: { user_id: req.userId },
      include: {
        expenses: {
          where: { user_id: req.userId, ...expenseWhere },
          select: { amount: true },
        },
      },
    });

    const result = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      expenses: cat.expenses.length,
      amount: cat.expenses.reduce((sum, e) => sum + e.amount, 0),
    }));

    const totalAmount = result.reduce((sum, cat) => sum + cat.amount, 0);

    const withPercent = result.map(cat => ({
      ...cat,
      percent: totalAmount > 0 ? (cat.amount / totalAmount) * 100 : 0,
    }));

    res.json(withPercent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get expenses for a specific category by name
router.get('/:name/expenses', async (req, res) => {
  try {
    const category = await prisma.category.findFirst({
      where: { name: { equals: req.params.name, mode: 'insensitive' }, user_id: req.userId },
    });

    if (!category) return res.status(404).json({ error: 'Category not found' });

    const expenses = await prisma.expense.findMany({
      where: { category_id: category.id, user_id: req.userId },
      orderBy: { date: 'desc' },
    });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
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
