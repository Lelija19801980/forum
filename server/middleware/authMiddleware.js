const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Trūksta arba neteisingas tokenas' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Vartotojas nerastas' });
    }

    req.user = user; //  turės user._id
    req.userId = user._id; //  papildomai pridėta suderinamumui
    next();
  } catch (err) {
    console.error('❌ Auth klaida:', err);
    return res.status(401).json({ message: 'Neteisingas arba pasibaigęs tokenas' });
  }
};







