import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  flex: 1;
`;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [statusFilter, setStatusFilter] = useState(query.get('status') || '');
  const [search, setSearch] = useState(query.get('search') || '');
  const [author, setAuthor] = useState(query.get('author') || '');

  // Automatinis URL atnaujinimas kai bet kuris keičiasi
  useEffect(() => {
    const q = new URLSearchParams();

    if (statusFilter) q.set('status', statusFilter);
    if (search) q.set('search', search);
    if (author) q.set('author', author);

    navigate(`/?${q.toString()}`);
  }, [statusFilter, search, author]);

  return (
    <Wrapper>
      <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">Visi klausimai</option>
        <option value="answered">Atsakyti</option>
        <option value="unanswered">Neatsakyti</option>
      </Select>

      <Input
        placeholder="Ieškoti pagal pavadinimą ar temą..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Input
        placeholder="Ieškoti pagal autorių..."
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
    </Wrapper>
  );
}

