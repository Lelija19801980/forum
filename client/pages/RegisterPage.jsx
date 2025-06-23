import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import api from '../utils/api';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default function RegisterPage() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Nepavyko užsiregistruoti');
    }
  };

  return (
    <div>
      <h2>Registracija</h2>
      <Form onSubmit={handleSubmit}>
        <input name="username" value={form.username} onChange={handleChange} placeholder="Vartotojo vardas" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="El. paštas" required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Slaptažodis" required />
        <button type="submit">Registruotis</button>
      </Form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}


