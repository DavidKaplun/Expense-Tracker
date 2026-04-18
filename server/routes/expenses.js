const express = require('express');
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Get all expenses
router.get('/', async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { user_id: req.userId },
    include: { category: true },
    orderBy: { date: 'desc' }
  });
  res.json(expenses);
});

// Add an expense
router.post('/', async (req, res) => {
  const { amount, description, date, category_id, invoice_path } = req.body;

  if (!amount || !date || !category_id) {
    return res.status(400).json({ error: 'Amount, date, and category are required' });
  }

  const expense = await prisma.expense.create({
    data: {
      amount,
      description,
      date: new Date(date),
      category_id,
      user_id: req.userId,
      invoice_path: invoice_path || null
    }
  });

  res.status(201).json(expense);
});

// Edit an expense
router.put('/:id', async (req, res) => {
  const { amount, description, date, category_id, invoice_path } = req.body;
  const id = parseInt(req.params.id);

  const expense = await prisma.expense.update({
    where: { id, user_id: req.userId },
    data: { amount, description, date: new Date(date), category_id, invoice_path }
  });

  res.json(expense);
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.expense.delete({
    where: { id, user_id: req.userId }
  });

  res.json({ message: 'Expense deleted' });
});

// Averages stats
router.get('/stats', async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { user_id: req.userId },
    select: { amount: true, date: true },
  });

  if (expenses.length === 0) {
    return res.json({ avgMonthly: 0, avgYearly: 0, monthCount: 0, yearCount: 0 });
  }

  const months = new Set(expenses.map(e => e.date.toISOString().slice(0, 7)));
  const years = new Set(expenses.map(e => e.date.getFullYear().toString()));
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  res.json({
    avgMonthly: total / months.size,
    avgYearly: total / years.size,
    monthCount: months.size,
    yearCount: years.size,
  });
});

// Monthly summary
router.get('/monthly', async (req, res) => {
  const { month } = req.query; // expects "YYYY-MM"

  let dateFilter = {};
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split('-').map(Number);
    dateFilter = {
      gte: new Date(y, m - 1, 1),
      lt: new Date(y, m, 1),
    };
  }

  const expenses = await prisma.expense.findMany({
    where: {
      user_id: req.userId,
      ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
    },
    include: { category: true },
    orderBy: { date: 'asc' },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  res.json({ total, expenses });
});

// Yearly summary
router.get('/yearly', async (req, res) => {
  const { year } = req.query; // expects "YYYY"

  let dateFilter = {};
  if (year && /^\d{4}$/.test(year)) {
    const y = parseInt(year);
    dateFilter = {
      gte: new Date(y, 0, 1),
      lt: new Date(y + 1, 0, 1),
    };
  }

  const expenses = await prisma.expense.findMany({
    where: {
      user_id: req.userId,
      ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
    },
    include: { category: true },
    orderBy: { date: 'asc' },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  res.json({ total, expenses });
});

module.exports = router;
