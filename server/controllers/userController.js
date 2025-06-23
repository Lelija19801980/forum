const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Gauti savo duomenis
exports.getUserProfile = async (req, res) => {
  res.json(req.user);
};

// Atnaujinti savo duomenis
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'Vartotojas nerastas' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
    });
  } catch (err) {
    console.error('❌ Klaida atnaujinant profilį:', err);
    res.status(500).json({ message: 'Nepavyko atnaujinti profilio' });
  }
};

// Ištrinti savo paskyrą
exports.deleteUserProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Paskyra sėkmingai ištrinta' });
  } catch (err) {
    console.error('❌ Klaida trinant profilį:', err);
    res.status(500).json({ message: 'Nepavyko ištrinti paskyros' });
  }
};




