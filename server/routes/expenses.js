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

// Monthly summary
router.get('/monthly', async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { user_id: req.userId },
    include: { category: true },
    orderBy: { date: 'asc' }
  });

  const summary = {};
  for (const expense of expenses) {
    const key = expense.date.toISOString().slice(0, 7); // "YYYY-MM"
    if (!summary[key]) summary[key] = { total: 0, expenses: [] };
    summary[key].total += expense.amount;
    summary[key].expenses.push(expense);
  }

  res.json(summary);
});

// Yearly summary
router.get('/yearly', async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { user_id: req.userId },
    include: { category: true },
    orderBy: { date: 'asc' }
  });

  const summary = {};
  for (const expense of expenses) {
    const year = expense.date.getFullYear().toString();
    if (!summary[year]) summary[year] = { total: 0, expenses: [] };
    summary[year].total += expense.amount;
    summary[year].expenses.push(expense);
  }

  res.json(summary);
});

module.exports = router;
