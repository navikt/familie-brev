import React from "react";
import styled from "styled-components";
import navLogo from "../assets/nav-logo-red.svg";

interface HeaderProps {
  tittel: string;
  navn: string;
  fødselsnr: string;
  visLogo?: boolean;
}

const StyledHeader = styled.div`
  position: relative;

  h3.tittel {
    margin-bottom: 5rem;
  }

  .navLogo {
    position: absolute;
    top: -1.5rem;
    right: 0;
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

    const { tittel, navn, fødselsnr, visLogo } = props;

  return (
    <StyledHeader>
        <h3 className="tittel">{tittel}</h3>
        {visLogo && <img className="navLogo" src={navLogo} />}
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
