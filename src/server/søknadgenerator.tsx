import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ISøknad, IVerdiliste } from '../typer/dokumentApiBrev';
import { dagensDatoFormatert } from './utils/util';
import css from './utils/css';
import søknadCSS from './utils/soknad-css';
import { NavIkon } from './components/ikoner/navIkon';
import Heading from './components/typografi/Heading';
import Line from './components/Line';
import TekstLabelVerdi from './components/typografi/TekstLabelVerdi';

export const genererSøknadHtml = (søknad: ISøknad) => {
  const lagVerdiliste = (verdier: IVerdiliste[], nivå: number) => {
    return verdier.map((verdiliste, index) => {
      const nivåClassName = `level-${nivå}`;
      const nyttAvsnitt = nivå < 1;
      return (
        <div key={index}>
          {nyttAvsnitt && <Heading size="medium" text={verdiliste.label} />}
          {verdiliste.verdiliste && lagVerdiliste(verdiliste.verdiliste, nivå + 1)}
          {verdiliste.alternativer && (
            <div className={`alternativer ${nivåClassName}`}>{verdiliste.alternativer}</div>
          )}
          {verdiliste.verdi && (
            <TekstLabelVerdi label={verdiliste.label} verdi={verdiliste.verdi} />
          )}
          {nyttAvsnitt && <Line />}
        </div>
      );
    });
  };

  const labelUtenBrevkode = søknad.label.replace(/\s*\(.*?\)\s*/g, '');
  const brevkode = søknad.label.match(/\((.*?)\)/)?.[1] || '';

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
          <div className={'header-container'}>
            <div>
              <Heading size={'large'} text={labelUtenBrevkode} />
              <p>{brevkode}</p>
              <p>Sendt inn: {dagensDatoFormatert()}</p>
            </div>
            <NavIkon />
          </div>
        </div>

        {lagVerdiliste(søknad.verdiliste, 0)}
      </body>
    </html>,
  );
};
