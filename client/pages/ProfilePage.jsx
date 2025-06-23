import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background: #ffe6f0;
  border-radius: 10px;
`;

const Title = styled.h2`
  text-align: center;
  color: #d63384;
`;

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  margin-top: 15px;
  background: #d63384;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #bf296e;
  }
`;

const DangerButton = styled(Button)`
  background: #dc3545;

  &:hover {
    background: #c82333;
  }
`;

const Message = styled.p`
  text-align: center;
  color: ${(props) => (props.$error ? 'red' : 'green')};
`;

const InfoBox = styled.div`
  background: #fff0f8;
  padding: 10px 15px;
  border: 1px solid #d63384;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export default function ProfilePage() {
  const { user, login, logout } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.patch('/users/me', {
        username,
        email,
        password: password || undefined,
        bio,
      });

      login(res.data, localStorage.getItem('token'));
      setMessage('✅ Profilis atnaujintas');
      setPassword('');
    } catch (err) {
      console.error('❌ Profilio atnaujinimo klaida:', err);
      setError('Nepavyko atnaujinti profilio');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Ar tikrai nori ištrinti paskyrą?')) return;
    try {
      await api.delete('/users/me');
      logout();
      navigate('/');
    } catch (err) {
      console.error('❌ Klaida trinant paskyrą:', err);
      setError('Nepavyko ištrinti paskyros');
    }
  };

  if (!user) return <p>⏳ Kraunama vartotojo informacija...</p>;

  return (
    <Container>
      <Title>Redaguoti profilį</Title>

      <InfoBox>
        <p><strong>Vartotojas:</strong> {user.username}</p>
        <p><strong>El. paštas:</strong> {user.email}</p>
        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
      </InfoBox>

      <form onSubmit={handleUpdate}>
        <Label>Vartotojo vardas</Label>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} required />

        <Label>El. paštas</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <Label>Naujas slaptažodis (jei keiti)</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Palik tuščią jei nekeiti"
        />
        <Button type="submit">Atnaujinti profilį</Button>
      </form>

      <DangerButton onClick={handleDelete}>❌ Ištrinti paskyrą</DangerButton>

      {message && <Message>{message}</Message>}
      {error && <Message $error>{error}</Message>}
    </Container>
  );
}





