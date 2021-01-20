import React from 'react';
import { NavIkon } from '../ikoner/navIkon';

interface HeaderProps {
  tittel: string;
  navn: string[];
  fodselsnr: string[];
  visLogo?: boolean;
}

function Header(props: HeaderProps) {
  const { tittel, navn, fodselsnr, visLogo } = props;

  if (fodselsnr.length !== 1) {
    throw Error(
      `Flettefeltet fodselsnr i dokument med tittel "${tittel}" forventer en liste med nøyaktig et element`,
    );
  }
  if (navn.length !== 1) {
    throw Error(
      `Flettefeltet navn i dokument med tittel "${tittel}" forventer en liste med nøyaktig et element`,
    );
  }

  return (
    <div className={'header'}>
      <div className="ikon-og-dato">
        {visLogo && <NavIkon />}
        <p>6. oktober 2020</p>
      </div>
      <div className={'tittel-og-personinfo'}>
        <h2 className="tittel">{tittel.toUpperCase()}</h2>
        <div className="kolonner">
          <div className="personinfo">
            <div>Navn: {navn}</div>
            <div>Fødselsnummer: {fodselsnr}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
