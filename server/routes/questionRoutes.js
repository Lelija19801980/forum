const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const questionController = require('../controllers/questionController');
const answerController = require('../controllers/answerController');

// Klausimai
router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', auth, questionController.createQuestion);
router.patch('/:id', auth, questionController.updateQuestion);
router.delete('/:id', auth, questionController.deleteQuestion);
router.post('/:id/like', auth, questionController.likeQuestion);
router.post('/:id/dislike', auth, questionController.dislikeQuestion);

// Atsakymai
router.post('/:questionId/answers', auth, answerController.addAnswer);
router.patch('/answers/:id', auth, answerController.updateAnswer);
router.delete('/answers/:id', auth, answerController.deleteAnswer);
router.post('/answers/:id/like', auth, answerController.likeAnswer);
router.post('/answers/:id/dislike', auth, answerController.dislikeAnswer);

module.exports = router;


