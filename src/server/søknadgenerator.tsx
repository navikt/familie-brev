import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ISøknad, IVerdiliste } from '../typer/dokumentApi';
import { dagensDatoFormatert } from '../utils/dato';
import css from './utils/css';
import søknadCSS from './utils/soknad-css';
import { NavIkon } from './components/ikoner/navIkon';

interface HeaderProps {
  nivå: number;
  children: React.ReactNode;
  className: string;
}

const HeaderSøknad = (props: HeaderProps) => {
  const { nivå, children, className } = props;
  switch (nivå) {
    case 0:
      return <h1 className={className}>{children}</h1>;
    case 1:
      return <h2 className={className}>{children}</h2>;
    case 2:
      return <h3 className={className}>{children}</h3>;
    case 3:
    case 4:
    default:
      return <h4 className={className}>{children}</h4>;
  }
};

export const genererSøknadHtml = (søknad: ISøknad) => {
  const lagVerdiliste = (verdier: IVerdiliste[], nivå: number) => {
    return verdier.map((verdiliste, index) => {
      const nivåClassName = `level-${nivå}`;
      return (
        <div key={index}>
          <HeaderSøknad nivå={nivå} className={nivåClassName}>
            {verdiliste.label}
          </HeaderSøknad>
          {verdiliste.verdiliste && lagVerdiliste(verdiliste.verdiliste, nivå + 1)}
          {verdiliste.alternativer && (
            <div className={`alternativer ${nivåClassName}`}>{verdiliste.alternativer}</div>
          )}
          {verdiliste.verdi && (
            <div className={nivåClassName}>{verdiliste.verdi.replace(/(\n\n)/gm, '\n')}</div>
          )}
        </div>
      );
    });
  };

  return renderToStaticMarkup(
    <html lang={'nb'}>
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <style type="text/css">{css}</style>
        <style type="text/css">{søknadCSS}</style>
        <title>{søknad.label}</title>
      </head>
      <body className={'body'}>
        <div className={'header'}>
          <div className="ikon-og-dato">
            <NavIkon />
            <p>{dagensDatoFormatert()}</p>
          </div>
          <div className={'stonad-tittel'}>
            <h1>{søknad.label}</h1>
          </div>
        </div>
        {lagVerdiliste(søknad.verdiliste, 0)}
      </body>
    </html>,
  );
};
