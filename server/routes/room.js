const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find({ type: 'public' });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const room = new Room({
      name,
      description,
      type: type || 'public',
      members: [req.user.id],
      createdBy: req.user.id
    });
    await room.save();
    res.status(201).json({ msg: 'Room created!', room });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    if (!room.members.includes(req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }
    res.json({ msg: 'Joined room!', room });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Room deleted!' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
