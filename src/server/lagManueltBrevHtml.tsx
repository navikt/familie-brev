import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { IManueltBrev } from '../typer/dokumentApi';
import { Brevhode } from './components/Brevhode';
import { dagensDatoFormatert } from '../utils/dato';
import css from './utils/css';

export const lagManueltBrevHtml = (brev: IManueltBrev) => {
  return renderToStaticMarkup(
    <html lang={'nb'}>
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <style type="text/css">{css}</style>
        <title>{brev.overskrift}</title>
      </head>
      <body className={'body'}>
        <Brevhode
          tittel={brev.overskrift}
          navn={brev.navn}
          fodselsnummer={brev.ident}
          brevOpprettetDato={brev.brevdato || dagensDatoFormatert()}
        />
        {brev.avsnitt?.map(avsnitt => (
          <>
            <h2>{avsnitt.deloverskrift} </h2>
            <p> {avsnitt.innhold} </p>
          </>
        ))}
        <div>
          <p style={{ float: 'left' }}>
            <div>Med vennlig hilsen </div>
            <div>NAV Arbeid og ytelser</div>
            <span style={{ marginRight: '20px' }}>{brev.saksbehandlersignatur}</span>
          </p>
        </div>
      </body>
    </html>,
  );
};
