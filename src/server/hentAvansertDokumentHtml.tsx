import * as React from 'react';
import { IAvansertDokumentVariabler } from '../typer/dokumentApi';
import AvansertDokument from './components/AvansertDokument';
import { client, Datasett } from './sanity/sanityClient';
import { renderToStaticMarkup } from 'react-dom/server';
import Context from './utils/Context';
import css from './utils/css';
import Header from './components/Header';
import { Maalform } from '../typer/sanitygrensesnitt';
import { DokumentType } from '../typer/dokumentType';

enum HtmlLang {
  NB = 'nb',
  NN = 'nn',
}

const hentAvansertDokumentHtml = async (
  dokumentVariabler: IAvansertDokumentVariabler,
  maalform: Maalform,
  dokumentApiNavn: string,
  datasett: Datasett,
  saksbehandlersignatur: string,
  besluttersignatur?: string,
): Promise<string> => {
  const tittelQuery = `*[_type == "dokumentmal" && apiNavn == "${dokumentApiNavn}" ][].tittel${
    maalform === Maalform.NB ? 'Bokmaal' : 'Nynorsk'
  }`;
  const tittel = (await client(datasett).fetch(tittelQuery))[0];

  const htmlLang = () => {
    switch (maalform) {
      case Maalform.NB:
        return HtmlLang.NB;
      case Maalform.NN:
        return HtmlLang.NN;
    }
  };

  const contextValue = { requests: [] };
  const asyncHtml = () => (
    <Context.Provider value={contextValue}>
      <html lang={htmlLang()}>
        <head>
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
          <style type="text/css">{css}</style>
          <title>{tittel}</title>
        </head>
        <body className={'body'}>
          <div>
            <Header
              visLogo={true}
              tittel={tittel}
              navn={dokumentVariabler?.flettefelter?.navn}
              fodselsnummer={dokumentVariabler?.flettefelter?.fodselsnummer}
              apiNavn={dokumentApiNavn}
              dato={dokumentVariabler?.flettefelter?.dato}
            />
            <AvansertDokument
              apiNavn={dokumentApiNavn}
              avanserteDokumentVariabler={dokumentVariabler}
              maalform={maalform}
              dokumentType={DokumentType.DOKUMENTMAL}
              datasett={datasett}
            />
            <div className={'signatur'}>
              <p style={{ float: 'left' }}>
                <span style={{ marginRight: '20px' }}>{saksbehandlersignatur}</span>
                <span>&mdash;</span>
                <span style={{ marginLeft: '20px' }}>{besluttersignatur}</span>
              </p>
            </div>
          </div>
        </body>
      </html>
    </Context.Provider>
  );

  async function byggDokument() {
    const html = renderToStaticMarkup(asyncHtml());
    await Promise.all(contextValue.requests);
    return html;
  }

  let i = 0;
  let dokument = await byggDokument();
  while (dokument !== (await byggDokument())) {
    if (i++ >= 100) {
      throw new Error('Dokumentet har en dybde på mer enn 100');
    }
    dokument = await byggDokument();
  }

  return dokument.replace(/(\r\n|\n|\r)/gm, '');
};

export default hentAvansertDokumentHtml;
