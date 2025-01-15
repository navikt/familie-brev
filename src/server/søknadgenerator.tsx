import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ISøknad, IVerdiliste } from '../typer/dokumentApiBrev';
import css from './utils/css';
import { Heading } from './components/typografi/Heading';
import { Line } from './components/Line';
import { TekstLabelVerdi } from './components/typografi/TekstLabelVerdi';
import { SøknadTittelOgIkon } from './components/SøknadTittelOgIkon';

export const genererSøknadHtml = (søknad: ISøknad) => {
  const lagVerdiliste = (verdier: IVerdiliste[], nivå: number) => {
    return verdier.map((verdiliste, index) => {
      const nyttAvsnitt = nivå < 1;
      return (
        <div key={index}>
          {nyttAvsnitt && <Heading size="medium" text={verdiliste.label} />}
          {verdiliste.verdiliste && lagVerdiliste(verdiliste.verdiliste, nivå + 1)}
          {verdiliste.verdi && (
            <TekstLabelVerdi
              label={verdiliste.label}
              verdi={verdiliste.verdi}
              alternativer={verdiliste.alternativer}
            />
          )}
          {nyttAvsnitt && <Line />}
        </div>
      );
    });
  };

  return renderToStaticMarkup(
    <html lang={'nb'}>
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <style type="text/css">{css}</style>
        {/* <style type="text/css">{søknadCSS}</style> */}
        <title>{søknad.label}</title>
      </head>
      <body className={'body'}>
        <SøknadTittelOgIkon søknad={søknad} />
        {lagVerdiliste(søknad.verdiliste, 0)}
      </body>
    </html>,
  );
};
