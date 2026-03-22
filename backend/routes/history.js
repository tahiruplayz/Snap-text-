const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const Scan = require('../models/Scan');

// GET /api/history
router.get('/history', authMiddleware, async (req, res, next) => {
  try {
    const scans = await Scan.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ scans });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/history/:id
router.delete('/history/:id', authMiddleware, async (req, res, next) => {
  try {
    await Scan.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
