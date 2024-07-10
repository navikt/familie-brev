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
          <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
            <tr>
              <td style={{ verticalAlign: 'middle', border: 'none' }}>
                <div>
                  <Heading size={'large'} text={labelUtenBrevkode} />
                  <p>{brevkode}</p>
                  <p>Sendt inn: {dagensDatoFormatert()}</p>
                </div>
              </td>
              <td
                style={{
                  width: '1%',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'middle',
                  border: 'none',
                }}
              >
                <NavIkon />
              </td>
            </tr>
          </table>
        </div>

        {lagVerdiliste(søknad.verdiliste, 0)}
      </body>
    </html>,
  );
};
