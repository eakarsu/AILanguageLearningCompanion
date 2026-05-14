const router = require('express').Router();
const { Progress } = require('../models');

router.get('/', async (req, res) => {
  try {
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const { count, rows } = await Progress.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
      return res.json({ data: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } });
    }
    res.json(await Progress.findAll({ order: [['createdAt', 'DESC']] }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/stats/summary', async (req, res) => {
  try {
    const allProgress = await Progress.findAll();
    const summary = {
      totalActivities: allProgress.length,
      totalTimeSpent: allProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0),
      averageScore: allProgress.length > 0 ? Math.round(allProgress.reduce((sum, p) => sum + (p.score || 0), 0) / allProgress.length) : 0,
      byFeature: {},
    };
    allProgress.forEach(p => {
      if (!summary.byFeature[p.feature]) {
        summary.byFeature[p.feature] = { count: 0, totalScore: 0 };
      }
      summary.byFeature[p.feature].count++;
      summary.byFeature[p.feature].totalScore += p.score || 0;
    });
    res.json(summary);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Progress.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.json(await Progress.create(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Progress.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Progress.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
