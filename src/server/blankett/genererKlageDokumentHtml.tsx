import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { IKlageDokumentData } from '../../typer/klageDokumentApi';
import { stønadstypeTilTekst } from '../../typer/klageDokumentApi';
import { KlageBehandling, KlageFormkrav, Klagevurdering } from './components/KlageBehandling';
import { Header } from './components/Header';
import css from '../utils/css';
import { datoFormat } from '../utils/util';
enum HtmlLang {
  NB = 'nb',
}

export const hentDokumentHtml = async (data: IKlageDokumentData): Promise<string> => {
  const asyncHtml = () => (
    <html lang={HtmlLang.NB}>
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <style type="text/css">{css}</style>
        <title>Saksbehandlingsblankett klage</title>
      </head>
      <body className={'body'}>
        <div>
          <Header
            visLogo={true}
            tittel={`Blankett klage ${stønadstypeTilTekst[data.behandling.stønadstype]}`}
            navn={data.personopplysninger.navn}
            fodselsnummer={data.personopplysninger.personIdent}
            dato={new Date().toLocaleDateString('no-NO', datoFormat)}
          />
          <KlageBehandling behandling={data.behandling} />
          <KlageFormkrav formkrav={data.formkrav} />
          <Klagevurdering vurdering={data.vurdering} />
        </div>
      </body>
    </html>
  );

  const htmldokument = asyncHtml();
  const dokument = await renderToStaticMarkup(htmldokument);

  return dokument;
};
