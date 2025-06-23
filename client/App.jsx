import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuestionPage from './pages/QuestionPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import NewQuestionPage from './pages/NewQuestionPage';
import EditQuestionPage from './pages/EditQuestionPage';
import Footer from './components/Footer';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #fff0f5;
    color: #333;
  }

  a {
    text-decoration: none;
    color: palevioletred;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 1rem;
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Container>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/ask" element={<NewQuestionPage />} />
          <Route path="/questions/:id" element={<QuestionPage />} />
          <Route path="/questions/:id/edit" element={<EditQuestionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}



