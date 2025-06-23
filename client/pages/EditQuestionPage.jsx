import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { UserContext } from '../context/UserContext';

export default function EditQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (id) fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const res = await api.get(`/questions/${id}`);
      const q = res.data.question;

      
      if (!user || q.author._id !== user._id) {
        setError('⛔ Neturite teisės redaguoti šio klausimo');
        return;
      }

      setTitle(q.title);
      setContent(q.content);
      setTags(q.tags?.join(', ') || '');
    } catch (err) {
      console.error('❌ Nepavyko gauti klausimo:', err);
      setError('Nepavyko gauti klausimo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        title,
        content,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await api.patch(`/questions/${id}`, payload);
      navigate(`/questions/${id}`);
    } catch (err) {
      console.error('❌ Nepavyko atnaujinti klausimo:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Nepavyko atnaujinti klausimo');
      }
    }
  };

  if (loading) return <p>⏳ Kraunama...</p>;
  if (error) return <p style={{ color: 'red' }}>❌ {error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>✏️ Redaguoti klausimą</h2>
      <form onSubmit={handleSubmit}>
        <label>Pavadinimas</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <label>Turinys</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ width: '100%', height: '120px', marginBottom: '1rem' }}
        />
        <button type="submit">💾 Išsaugoti pakeitimus</button>
      </form>
    </div>
  );
}

