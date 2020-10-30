import React from "react";
import styled from "styled-components";

interface HeaderProps {
  tittel: string;
  navn: string;
  fødselsnr: string;
}

const StyledHeader = styled.div`
  h3.tittel {
    margin-bottom: 5rem;
  }

  .kolonner {
    margin-bottom: 4rem;
    display: flex;
    justify-content: space-between;

    .personinfo {
      display: flex;
      flex-direction: column;

      span {
        margin-bottom: 1rem;
      }
    }
  }
`;


function Header(props: HeaderProps) {

    const { tittel, navn, fødselsnr } = props;

  return (
    <StyledHeader>
      <h3 className="tittel">{tittel}</h3>
      <div className="kolonner">
        <div className="personinfo">
          <span>Navn: {navn}</span>
          <span>Fødselsnr: {fødselsnr}</span>
        </div>
        <div className="dato">
          <span>6. oktober 2020</span>
        </div>
      </div>
    </StyledHeader>
  );
}

export default Header;
