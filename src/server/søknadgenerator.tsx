import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ISøknad, IVerdiliste } from '../typer/dokumentApiBrev';
import { dagensDatoFormatert } from './utils/util';
import css from './utils/css';
import søknadCSS from './utils/soknad-css';
import { NavIkon } from './components/ikoner/navIkon';
import Heading from './components/typografi/Heading';

export const genererSøknadHtml = (søknad: ISøknad) => {
  const lagVerdiliste = (verdier: IVerdiliste[]) => {
    return <div>{JSON.stringify(verdier)}</div>;
    // return verdier.map((verdiliste, index) => {
    //   const nivåClassName = `level-${nivå}`;
    //   return (
    //     <div key={index}>
    //       <Heading size="medium" text={verdiliste.label} />
    //       {verdiliste.verdiliste && lagVerdiliste(verdiliste.verdiliste, nivå + 1)}
    //       {verdiliste.alternativer && (
    //         <div className={`alternativer ${nivåClassName}`}>{verdiliste.alternativer}</div>
    //       )}
    //       {verdiliste.verdi && (
    //         <div className={nivåClassName}>{verdiliste.verdi.replace(/(\n\n)/gm, '\n')}</div>
    //       )}
    //       <Line />
    //     </div>
    //   );
    // });
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

        {lagVerdiliste(søknad.verdiliste)}
      </body>
    </html>,
  );
};
