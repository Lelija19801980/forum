const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Užpildykite visus laukus' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'El. paštas jau naudojamas' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'Registracija sėkminga',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
      token,
    });
  } catch (err) {
    console.error('❌ Registracijos klaida:', err);
    res.status(500).json({ message: 'Serverio klaida registruojantis' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Įveskite el. paštą ir slaptažodį' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Neteisingas el. paštas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Neteisingas slaptažodis' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
      token,
    });
  } catch (err) {
    console.error('❌ Prisijungimo klaida:', err);
    res.status(500).json({ message: 'Serverio klaida prisijungiant' });
  }
};

