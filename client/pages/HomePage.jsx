import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import styled from 'styled-components';

const QuestionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const QuestionItem = styled.li`
  background: #ffe4ec;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
`;

const Pagination = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;


  useEffect(() => {
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    fetchQuestions();
  }, [sort, page, location.search]);

  const fetchQuestions = async () => {
    try {
      const query = new URLSearchParams(location.search);
      query.set('sort', sort);
      query.set('page', page);

      const res = await api.get(`/questions?${query.toString()}`);
      console.log('Questions iš serverio:', res.data);
      setQuestions(res.data.questions || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Klausimų klaida:', err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    const query = new URLSearchParams(location.search);
    query.set('page', newPage);
    navigate(`/?${query.toString()}`);
    setPage(newPage);
  };

  return (
    <div>
      <h2>Visi klausimai</h2>

      <label>Rikiuoti:</label>
      <select onChange={(e) => setSort(e.target.value)} value={sort}>
        <option value="newest">Naujausi</option>
        <option value="oldest">Seniausi</option>
        <option value="mostLiked">Daugiausiai Like</option>
        <option value="mostAnswers">Daugiausiai Atsakymų</option>
      </select>

      <QuestionList>
        {questions.map((q) => (
          <QuestionItem key={q._id}>
            <Link to={`/questions/${q._id}`}>
              <strong>{q.title}</strong>
            </Link>
            <p>{q.content}</p>
            <p>
              Autorius: {q.author?.username || 'Anonimas'} • {q.likes || 0} like(s)
            </p>
            <p>
              Sukurtas: {q.createdAt ? new Date(q.createdAt).toLocaleString() : 'Nežinoma'}
            </p>
          </QuestionItem>
        ))}
      </QuestionList>

      {totalPages > 1 && (
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => handlePageChange(pageNum)}
                disabled={page === pageNum}
              >
                {pageNum}
              </button>
            );
          })}
        </Pagination>
      )}
    </div>
  );
}





