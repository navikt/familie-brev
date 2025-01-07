import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import css from '../utils/css';
import { NæringsinntektDokumentData } from '../../typer/dokumentApiNæringsinntekt';
import { Header } from './components/Header';
import { Inntekt } from './components/Inntekt';

enum HtmlLang {
  NB = 'nb',
}

export const hentDokumentHtmlNæringsinntekt = async (
  data: NæringsinntektDokumentData,
): Promise<string> => {
  const asyncHtml = () => (
    <html lang={HtmlLang.NB}>
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <style type="text/css">{css}</style>
        <title>Næringsinntekt</title>
      </head>
      <body className={'body'}>
        <div>
          <Header
            saksid={data.saksid}
            navn={data.navn}
            personident={data.personIdent}
            saksbehandlernavn={data.saksbehandlernavn}
            enhet={data.enhet}
            årstall={data.årstall}
          />
          <Inntekt
            forventetInntekt={data.forventetInntekt}
            næringsinntekt={data.næringsinntekt}
            personinntekt={data.personinntekt}
            årstall={data.årstall}
          />
        </div>
      </body>
    </html>
  );

  const htmldokument = asyncHtml();
  const dokument = await renderToStaticMarkup(htmldokument);

  return dokument;
};
