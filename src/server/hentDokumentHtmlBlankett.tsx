import * as React from 'react';

import Dokument from './blankett/components/blankett/Dokument';
import { renderToStaticMarkup } from 'react-dom/server';
import css from './utils/css';
import Header from './blankett/components/blankett/Header';
import { datoFormat } from './utils/util';
import { Behandling } from './blankett/components/blankett/Behandling';
import { ÅrsakRevurdering } from './blankett/components/blankett/ÅrsakRevurdering';
import type { IDokumentData } from '../typer/dokumentApi';
import { stønadstypeTilTekst } from '../typer/dokumentApi';

enum HtmlLang {
  NB = 'nb',
}

const hentDokumentHtmlBlankett = async (data: IDokumentData): Promise<string> => {
  const asyncHtml = () => (
    <html lang={HtmlLang.NB}>
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <style type="text/css">{css}</style>
        <title>Saksbehandlingsblankett</title>
      </head>
      <body className={'body'}>
        <div>
          <Header
            visLogo={true}
            tittel={`Blankett ${stønadstypeTilTekst[data.behandling.stønadstype]}`}
            navn={data.personopplysninger.navn}
            fodselsnummer={data.personopplysninger.personIdent}
            dato={new Date().toLocaleDateString('no-NO', datoFormat)}
          />
          <Behandling behandling={data.behandling} />
          <ÅrsakRevurdering årsakRevurdering={data.behandling.årsakRevurdering} />
          <Dokument dokumentData={data} />
        </div>
      </body>
    </html>
  );

  const htmldokument = asyncHtml();
  const dokument = await renderToStaticMarkup(htmldokument);

  return dokument;
};

export default hentDokumentHtmlBlankett;
