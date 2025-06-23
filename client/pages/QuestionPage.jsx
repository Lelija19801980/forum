import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { UserContext } from '../context/UserContext';

export default function QuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data.question);
      setAnswers(Array.isArray(res.data.answers) ? res.data.answers : []);
    } catch (err) {
      console.error('❌ Nepavyko gauti klausimo:', err);
    }
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/answers/question/${id}`, { content });
      setContent('');
      fetchQuestion();
    } catch (err) {
      console.error('❌ Atsakymo klaida:', err);
      setError('Nepavyko išsiųsti atsakymo');
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`/questions/${id}/like`);
      fetchQuestion();
    } catch (err) {
      console.error('❌ Like klaida:', err);
    }
  };

  const handleDislike = async () => {
    try {
      await api.post(`/questions/${id}/dislike`);
      fetchQuestion();
    } catch (err) {
      console.error('❌ Dislike klaida:', err);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm('Ar tikrai nori ištrinti šį klausimą?')) return;
    try {
      await api.delete(`/questions/${id}`);
      navigate('/');
    } catch (err) {
      console.error('❌ Klaida trinant klausimą:', err);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Ištrinti šį atsakymą?')) return;
    try {
      await api.delete(`/answers/${answerId}`);
      fetchQuestion();
    } catch (err) {
      console.error('❌ Klaida trinant atsakymą:', err);
    }
  };

  const handleEditStart = (answer) => {
    setEditingId(answer._id);
    setEditContent(answer.content);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleEditSubmit = async (e, answerId) => {
    e.preventDefault();
    try {
      await api.patch(`/answers/${answerId}`, { content: editContent });
      setEditingId(null);
      setEditContent('');
      fetchQuestion();
    } catch (err) {
      console.error('❌ Klaida atnaujinant atsakymą:', err);
    }
  };

  const handleAnswerLike = async (answerId) => {
    try {
      await api.post(`/answers/${answerId}/like`);
      fetchQuestion();
    } catch (err) {
      console.error('❌ Atsakymo like klaida:', err.response?.data || err);
    }
  };

  const handleAnswerDislike = async (answerId) => {
    try {
      await api.post(`/answers/${answerId}/dislike`);
      fetchQuestion();
    } catch (err) {
      console.error('❌ Atsakymo dislike klaida:', err.response?.data || err);
    }
  };

  if (!question) return <p>⏳ Kraunama...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h2>{question.title}</h2>
      <p>{question.content}</p>
      <p><strong>Autorius:</strong> {question.author?.username}</p>
      <p>{question.likes} like(s)</p>

      <button onClick={handleLike}>👍 Like</button>
      <button onClick={handleDislike} style={{ marginLeft: '0.5rem' }}>👎 Dislike</button>

      {user && user._id === question.author?._id && (
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/questions/${question._id}/edit`} style={{ marginRight: '1rem' }}>
            ✏️ Redaguoti
          </Link>
          <button onClick={handleDeleteQuestion} style={{ color: 'red' }}>
            🗑️ Ištrinti klausimą
          </button>
        </div>
      )}

      <h3 style={{ marginTop: '2rem' }}>Atsakymai</h3>
      {answers.length > 0 ? (
        answers.map((a) => (
          <div key={a._id} style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
            <p><strong>{a.author?.username || 'Anonimas'}:</strong></p>

            {editingId === a._id ? (
              <form onSubmit={(e) => handleEditSubmit(e, a._id)}>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  required
                  style={{ width: '100%', minHeight: '80px' }}
                />
                <button type="submit">💾 Išsaugoti</button>
                <button type="button" onClick={handleEditCancel} style={{ marginLeft: '0.5rem' }}>
                  Atšaukti
                </button>
              </form>
            ) : (
              <p>{a.content}</p>
            )}

            <p>
              👍 {a.likes?.length || 0} | 👎 {a.dislikes?.length || 0}
            </p>

            <button onClick={() => handleAnswerLike(a._id)}>👍 Like</button>
            <button onClick={() => handleAnswerDislike(a._id)} style={{ marginLeft: '0.5rem' }}>👎 Dislike</button>

            {user && user._id === a.author?._id && editingId !== a._id && (
              <>
                <button onClick={() => handleEditStart(a)} style={{ marginLeft: '1rem' }}>
                  ✏️ Redaguoti
                </button>
                <button onClick={() => handleDeleteAnswer(a._id)} style={{ color: 'red', marginLeft: '0.5rem' }}>
                  🗑️ Ištrinti
                </button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>Kol kas nėra atsakymų.</p>
      )}

      {user ? (
        <form onSubmit={handleAnswer} style={{ marginTop: '2rem' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Įveskite atsakymą"
            required
            style={{ width: '100%', minHeight: '80px' }}
          />
          <button type="submit" style={{ marginTop: '0.5rem' }}>Atsakyti</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <p>Prisijunkite norėdami parašyti atsakymą.</p>
      )}
    </div>
  );
}


