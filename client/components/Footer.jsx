import React from 'react';
import styled from 'styled-components';

const FooterStyled = styled.footer`
  background-color: palevioletred;
  color: white;
  padding: 1rem;
  text-align: center;
  margin-top: 2rem;
`;

export default function Footer() {
  return (
    <FooterStyled>
      <p>&copy; {new Date().getFullYear()} Forumas. Sukurta su ❤️</p>
    </FooterStyled>
  );
}

