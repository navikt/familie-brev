import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { IFritekstbrevMedSignatur } from '../typer/dokumentApi';
import { Brevhode } from './components/Brevhode';
import { dagensDatoFormatert, formaterIsoDato } from '../utils/dato';
import css from './utils/css';

export const lagManueltBrevHtml = (brevMedSignatur: IFritekstbrevMedSignatur) => {
  const brev = brevMedSignatur.brevFraSaksbehandler;
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
          fodselsnummer={brev.personIdent}
          brevOpprettetDato={
            (brev.brevdato && formaterIsoDato(brev.brevdato)) || dagensDatoFormatert()
          }
        />
        {brev.avsnitt?.map(avsnitt => (
          <p>
            {avsnitt.deloverskrift && <strong>{avsnitt.deloverskrift} </strong>}
            {avsnitt.deloverskrift && <br />}
            {avsnitt.innhold}{' '}
          </p>
        ))}
        <div>
          <p style={{ float: 'left' }}>
            <div>Med vennlig hilsen </div>
            <div>NAV Arbeid og ytelser</div>
            <span style={{ marginRight: '20px' }}>
              {brevMedSignatur.saksbehandlersignatur}{' '}
              {brevMedSignatur.besluttersignatur && <>- {brevMedSignatur.besluttersignatur}</>}
            </span>
          </p>
        </div>
      </body>
    </html>,
  );
};
