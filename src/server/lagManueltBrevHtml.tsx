import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { IFritekstbrevMedSignatur } from '../typer/dokumentApiBrev';
import { Brevhode } from './components/Brevhode';
import { dagensDatoFormatert } from './utils/util';
import css from './utils/css';

export const lagManueltBrevHtml = (brevMedSignatur: IFritekstbrevMedSignatur) => {
  const brev = brevMedSignatur.brevFraSaksbehandler;
  const erSamværsberegning = brevMedSignatur.erSamværsberegning || false;

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
          {utledBrevsignatur(erSamværsberegning, brevMedSignatur)}
        </div>
      </body>
    </html>,
  );
};

const utledBrevsignatur = (
  erSamværsberegning: boolean,
  brevMedSignatur: IFritekstbrevMedSignatur,
) => {
  if (erSamværsberegning) {
    return (
      <div style={{ float: 'left' }}>
        <div>{`Journalført av ${brevMedSignatur.saksbehandlersignatur}`}</div>
      </div>
    );
  }

  return (
    <div style={{ float: 'left' }}>
      <div>Med vennlig hilsen</div>
      <div>
        {brevMedSignatur.besluttersignatur && brevMedSignatur.besluttersignatur?.trim() && (
          <span style={{ marginRight: '20px' }}>{brevMedSignatur.besluttersignatur}</span>
        )}
        {brevMedSignatur.saksbehandlersignatur}
      </div>
      <div>{brevMedSignatur.enhet || 'Nav Arbeid og ytelser'}</div>
    </div>
  );
};
