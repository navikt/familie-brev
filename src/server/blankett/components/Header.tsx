import React from 'react';
import { NavIkon } from '../../components/ikoner/navIkon';
import Heading from '../../components/typografi/Heading';

interface HeaderProps {
  tittel: string;
  navn: string;
  fodselsnummer: string;
  dato: string;
  visLogo?: boolean;
}

function Header(props: HeaderProps) {
  const { tittel, navn, fodselsnummer, visLogo, dato } = props;

  return (
    <div className={'header'}>
      <div className="header-container">
        <div>
          <Heading size={'large'} text={tittel.toUpperCase()} />
          <p>Sendt inn: {dato}</p>
        </div>
        <NavIkon />
      </div>

      {/* <div className="ikon-og-dato-wrapper">
        <div className="ikon-og-dato">
          {visLogo && <NavIkon />}
          <p>{dato}</p>
        </div>
      </div> */}
      {/* <div className={'tittel-og-personinfo'}>
        <h2 className="tittel">{tittel.toUpperCase()}</h2>
        <div className="kolonner">
          <div className="personinfo">
            <div>Navn: {navn}</div>
            <div>Fødsels eller D-nummer: {fodselsnummer}</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Header;
