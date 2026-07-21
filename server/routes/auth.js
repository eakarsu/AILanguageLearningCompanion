const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authenticate = require('../middleware/auth');
router.use((req, res, next) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 ||
      !/^[A-Za-z0-9][A-Za-z0-9._:-]+$/.test(process.env.GOVERNANCE_TENANT_ID || '')) {
    return res.status(503).json({ error: 'Authentication is not configured' });
  }
  next();
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || password.length < 12) return res.status(400).json({ error: 'Valid email and 12-character password required' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'learner', tenantId: process.env.GOVERNANCE_TENANT_ID }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'learner', tenantId: process.env.GOVERNANCE_TENANT_ID }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'nativeLanguage', 'learningLanguage', 'level'],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
