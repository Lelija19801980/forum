import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';

const Nav = styled.nav`
  background-color: palevioletred;
  padding: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  a {
    color: white;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    background: none;
    border: none;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }

  button:hover {
    text-decoration: underline;
  }
`;
const LogoLink = styled(Link)`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Header() {
  const { user, logout } = useContext(UserContext);

  return (
    <Nav>
       <LogoLink to="/">Forum</LogoLink>
      <NavLinks>
        {user ? (
          <>
            <span>Sveiki, {user.username}</span>
            <Link to="/ask">Įrašyti miestą</Link>
            <Link to="/profile">Profilis</Link>
            <button onClick={logout}>Atsijungti</button>
          </>
        ) : (
          <>
            <Link to="/login">Prisijungti</Link>
            <Link to="/register">Registruotis</Link>
          </>
        )}
      </NavLinks>
    </Nav>
  );
}