import React from "react";
import styled from "styled-components";
import navLogo from "../assets/nav-logo-red.svg";
import { NavIkon } from "../ikoner/navIkon";

interface HeaderProps {
  tittel: string;
  navn: string;
  fødselsnr: string;
  visLogo?: boolean;
}

function Header(props: HeaderProps) {
  const { tittel, navn, fødselsnr, visLogo } = props;

  return (
    <div className={"header"}>
      <div className="ikon-og-dato">
        {visLogo && <NavIkon />}
        <p>6. oktober 2020</p>
      </div>
      <div className={"tittel-og-personinfo"}>
        <h2 className="tittel">{tittel.toUpperCase()}</h2>
        <div className="kolonner">
          <div className="personinfo">
            <div>Navn: {navn}</div>
            <div>Fødselsnr: {fødselsnr}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
