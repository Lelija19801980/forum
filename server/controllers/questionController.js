const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const mongoose = require('mongoose');



// Gauti visus klausimus su rūšiavimu ir puslapiavimu
exports.getAllQuestions = async (req, res) => {
  try {
    const sort = req.query.sort || 'newest';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'mostLiked') sortOption = { likes: -1 };
    if (sort === 'mostAnswers') sortOption = { answerCount: -1 };

    const questions = await Question.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('author', 'username');

    const total = await Question.countDocuments();

    res.json({ questions, total });
  } catch (err) {
    console.error('❌ Klaida gaunant klausimus:', err);
    res.status(500).json({ message: 'Nepavyko gauti klausimų' });
  }
};

// Gauti vieną klausimą su visais atsakymais
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Netinkamas ID' });

    const question = await Question.findById(id).populate('author', 'username');
    if (!question) return res.status(404).json({ message: 'Klausimas nerastas' });

    const answers = await Answer.find({ question: id }).populate('author', 'username');

    res.json({ question, answers });
  } catch (err) {
    console.error('❌ Klaida gaunant klausimą:', err);
    res.status(500).json({ message: 'Nepavyko gauti klausimo' });
  }
};

// Sukurti naują klausimą
exports.createQuestion = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const question = new Question({
      title,
      content,
      tags: tags || [],
      author: req.userId,
    });

    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error('❌ Klaida kuriant klausimą:', err);
    res.status(500).json({ message: 'Nepavyko sukurti klausimo' });
  }
};

// Redaguoti klausimą
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Klausimas nerastas' });

    if (question.author.toString() !== req.userId.toString())
      return res.status(403).json({ message: 'Negalite redaguoti šio klausimo' });

    question.title = title || question.title;
    question.content = content || question.content;
    question.tags = tags || question.tags;
    question.updatedAt = Date.now();

    await question.save();
    res.json(question);
  } catch (err) {
    console.error('❌ Klaida atnaujinant klausimą:', err);
    res.status(500).json({ message: 'Nepavyko atnaujinti klausimo' });
  }
};

// Ištrinti klausimą
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Klausimas nerastas' });

    if (question.author.toString() !== req.userId.toString())
      return res.status(403).json({ message: 'Negalite ištrinti šio klausimo' });

    await Answer.deleteMany({ question: id });
    await Question.findByIdAndDelete(id);

    res.json({ message: 'Klausimas ir atsakymai ištrinti' });
  } catch (err) {
    console.error('❌ Klaida trinant klausimą:', err);
    res.status(500).json({ message: 'Nepavyko ištrinti klausimo' });
  }
};

// Pridėti like
exports.likeQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Klausimas nerastas' });

    question.likes++;
    await question.save();

    res.json(question);
  } catch (err) {
    console.error('❌ Klaida dedant like:', err);
    res.status(500).json({ message: 'Nepavyko pridėti like' });
  }
};

// Atimti like
exports.dislikeQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Klausimas nerastas' });

    question.likes = Math.max(0, question.likes - 1);
    await question.save();

    res.json(question);
  } catch (err) {
    console.error('❌ Klaida mažinant like:', err);
    res.status(500).json({ message: 'Nepavyko sumažinti like' });
  }
};

// Gauti visus klausimus su filtravimu, rikiavimu ir puslapiavimu
exports.getAllQuestions = async (req, res) => {
  try {
    const { sort = 'newest', page = 1, search = '', status = '', author = '' } = req.query;
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'mostLiked') sortOption = { likes: -1 };

    const filter = {};

    // Filtravimas pagal paiešką (title/content/tags)
    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Filtravimas pagal autorių (dalinė atitiktis)
    if (author.trim()) {
      const users = await require('../models/User').find({
        username: { $regex: author, $options: 'i' },
      });
      const userIds = users.map((u) => u._id);
      filter.author = { $in: userIds };
    }

    // Gauti visus klausimus pagal filtrus
    const questions = await Question.find(filter)
      .sort(sortOption)
      .populate('author', 'username');

    // Gauti atsakymų kiekį kiekvienam klausimui
    const withAnswers = await Promise.all(
      questions.map(async (q) => {
        const count = await Answer.countDocuments({ question: q._id });
        return { ...q._doc, answerCount: count };
      })
    );

    // Filtravimas pagal atsakytus/neatsakytus
    let filtered = withAnswers;
    if (status === 'answered') {
      filtered = filtered.filter((q) => q.answerCount > 0);
    } else if (status === 'unanswered') {
      filtered = filtered.filter((q) => q.answerCount === 0);
    }

    // Rikiavimas pagal atsakymų kiekį, jei nurodyta
    if (sort === 'mostAnswers') {
      filtered.sort((a, b) => b.answerCount - a.answerCount);
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    res.json({ questions: paginated, total });
  } catch (err) {
    console.error('❌ Klaida filtruojant klausimus:', err);
    res.status(500).json({ message: 'Nepavyko gauti klausimų' });
  }
};



