import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { IFritekstbrevMedSignatur } from '../typer/dokumentApi';
import { Brevhode } from './components/Brevhode';
import { dagensDatoFormatert } from './utils/util';
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
          brevOpprettetDato={brevMedSignatur.datoPlaceholder || dagensDatoFormatert()}
        />
        {brev.avsnitt?.map((avsnitt, index) => (
          <p key={index}>
            {avsnitt.deloverskrift && <strong>{avsnitt.deloverskrift} </strong>}
            {avsnitt.deloverskrift && <br />}
            {avsnitt.innhold && <span style={{ whiteSpace: 'pre-wrap' }}>{avsnitt.innhold}</span>}
          </p>
        ))}
        <div>
          <br />
          <p style={{ float: 'left' }}>
            <div>Med vennlig hilsen </div>
            <div>{brevMedSignatur.enhet || 'NAV Arbeid og ytelser'}</div>
            <br />
            <div style={{ marginRight: '20px' }}>
              {brevMedSignatur.saksbehandlersignatur}{' '}
              {brevMedSignatur.besluttersignatur && (
                <span style={{ marginLeft: '20px' }}>{brevMedSignatur.besluttersignatur}</span>
              )}
            </div>
          </p>
        </div>
      </body>
    </html>,
  );
};
