const Answer = require('../models/Answer');
const mongoose = require('mongoose');

// ➕ Sukurti naują atsakymą
exports.addAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: 'Netinkamas klausimo ID' });
    }

    const answer = new Answer({
      question: questionId,
      author: req.user._id, // užtikrinam kad yra prisijungęs
      content,
    });

    await answer.save();
    res.status(201).json(answer);
  } catch (err) {
    console.error('❌ Klaida kuriant atsakymą:', err);
    res.status(500).json({ message: 'Nepavyko sukurti atsakymo' });
  }
};

// Atnaujinti atsakymą
exports.updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Atsakymas nerastas' });

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Negalite redaguoti šio atsakymo' });
    }

    answer.content = req.body.content;
    answer.updatedAt = new Date();
    await answer.save();

    res.json(answer);
  } catch (err) {
    console.error('❌ Klaida redaguojant atsakymą:', err);
    res.status(500).json({ message: 'Nepavyko atnaujinti atsakymo' });
  }
};

//  Ištrinti atsakymą
exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Atsakymas nerastas' });

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Negalite ištrinti šio atsakymo' });
    }

    await answer.deleteOne();
    res.json({ message: 'Atsakymas ištrintas' });
  } catch (err) {
    console.error('❌ Klaida trinant atsakymą:', err);
    res.status(500).json({ message: 'Nepavyko ištrinti atsakymo' });
  }
};

//  Like atsakymui
exports.likeAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const userId = req.user._id;

    if (!answer) return res.status(404).json({ message: 'Atsakymas nerastas' });
    if (answer.likes.includes(userId)) {
      return res.status(400).json({ message: 'Jau palaikinote šį atsakymą' });
    }

    answer.likes.push(userId);
    answer.dislikes = answer.dislikes.filter(id => id.toString() !== userId.toString());
    await answer.save();

    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: 'Nepavyko pridėti like' });
  }
};

//  Dislike atsakymui
exports.dislikeAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const userId = req.user._id;

    if (!answer) return res.status(404).json({ message: 'Atsakymas nerastas' });
    if (answer.dislikes.includes(userId)) {
      return res.status(400).json({ message: 'Jau paspaudėte dislike' });
    }

    answer.dislikes.push(userId);
    answer.likes = answer.likes.filter(id => id.toString() !== userId.toString());
    await answer.save();

    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: 'Nepavyko pridėti dislike' });
  }
};






