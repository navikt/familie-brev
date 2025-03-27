import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Heading, IAvsnitt, IFritekstbrevMedSignatur } from '../typer/dokumentApiBrev';
import { Brevhode } from './components/Brevhode';
import { dagensDatoFormatert, dagensDatoFormatertLang } from './utils/util';
import css from './utils/css';
import cssFritekstbrevBaks from './utils/css-fritekstbrev-baks';
import { BrevhodeBaks } from './components/BrevhodeBaks';

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

export const lagManueltBrevBaksHtml = (brevMedSignatur: IFritekstbrevMedSignatur) => {
  const brev = brevMedSignatur.brevFraSaksbehandler;
  const erSamværsberegning = brevMedSignatur.erSamværsberegning || false;

  return renderToStaticMarkup(
    <html lang={'nb'}>
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <style type="text/css">{cssFritekstbrevBaks}</style>
        <title>{brev.overskrift}</title>
      </head>
      <body>
        <BrevhodeBaks
          navn={brev.navn}
          fødselsnummer={brev.personIdent}
          brevOpprettetDato={brevMedSignatur.datoPlaceholder || dagensDatoFormatertLang()}
        />
        <h1>{brev.overskrift}</h1>
        {brev.avsnitt?.map((avsnitt, _) => {
          return (
            <>
              {avsnitt.deloverskrift && utledDeloverskrift(avsnitt)}
              {avsnitt.innhold && <p style={{ whiteSpace: 'pre-wrap' }}>{avsnitt.innhold}</p>}
            </>
          );
        })}
        <div className="signatur">{utledBrevsignatur(erSamværsberegning, brevMedSignatur)}</div>
      </body>
    </html>,
  );
};

const utledDeloverskrift = (avsnitt: IAvsnitt) => {
  switch (avsnitt.deloverskriftHeading) {
    case Heading.H1:
      return <h1>{avsnitt.deloverskrift}</h1>;
    case Heading.H2:
      return <h2>{avsnitt.deloverskrift}</h2>;
    case Heading.H3:
      return <h3>{avsnitt.deloverskrift}</h3>;
    case Heading.H4:
      return <h4>{avsnitt.deloverskrift}</h4>;
    case Heading.H5:
      return <h5>{avsnitt.deloverskrift}</h5>;
    case Heading.H6:
      return <h6>{avsnitt.deloverskrift}</h6>;
    default:
      return (
        <>
          <strong>{avsnitt.deloverskrift}</strong>
          <br />
        </>
      );
  }
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
      <div>{brevMedSignatur.enhet || 'Nav Arbeid og ytelser'}</div>
      <br />
      <div>
        {brevMedSignatur.besluttersignatur && brevMedSignatur.besluttersignatur?.trim() && (
          <span style={{ marginRight: '20px' }}>{brevMedSignatur.besluttersignatur}</span>
        )}
        {brevMedSignatur.saksbehandlersignatur}
      </div>
    </div>
  );
};
