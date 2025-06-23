// server/routes/answerRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const answerController = require('../controllers/answerController');

// ✅ Sukurti atsakymą į klausimą
router.post('/question/:questionId', auth, answerController.addAnswer);

// ✅ Atnaujinti atsakymą
router.patch('/:id', auth, answerController.updateAnswer);

// ✅ Ištrinti atsakymą
router.delete('/:id', auth, answerController.deleteAnswer);

// 👉 LIKES MARŠRUTUS
router.post('/:id/like', auth, answerController.likeAnswer);
router.post('/:id/dislike', auth, answerController.dislikeAnswer);

module.exports = router;



