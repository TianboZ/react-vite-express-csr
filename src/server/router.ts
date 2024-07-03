import express from 'express';

const router = express.Router();

router.get('/hello', async (_req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

router.post('/add', async (_req, res) => {
  res.status(200).json({ message: 'ok' });
});

export default router;
