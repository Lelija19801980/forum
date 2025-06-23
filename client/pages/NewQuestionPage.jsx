import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  font-size: 1rem;
  min-height: 150px;
`;

const Button = styled.button`
  background-color: palevioletred;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #c94a72;
  }
`;

const Error = styled.p`
  color: red;
  margin-top: 1rem;
`;

export default function NewQuestionPage() {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/questions', {
        title,
        content
      });
      navigate(`/questions/${res.data._id}`);
    } catch (err) {
      console.error('❌ Nepavyko sukurti klausimo:', err);
      setError('Nepavyko sukurti klausimo');
    }
  };

  if (!user) return <p>🔒 Prisijunkite, kad galėtumėte užduoti klausimą.</p>;

  return (
    <Container>
      <h2>Užduoti naują klausimą</h2>
      <Form onSubmit={handleSubmit}>
        <Label>Pavadinimas</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <Label>Turinys</Label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} required />

        <Button type="submit">Paskelbti</Button>
      </Form>
      {error && <Error>{error}</Error>}
    </Container>
  );
}
