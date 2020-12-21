import * as React from 'react';
import { IDokumentVariabler } from '../sanity/DokumentVariabler';
import { Maalform } from '../sanity/hentGrenesnittFraDokument';
import Dokument from '../components/Dokument';
import { Datasett } from '../sanity/sanityClient';
import { renderToStaticMarkup } from 'react-dom/server';
import Context from './Context';
import css from './css';
import Header from '../components/Header';
import { client } from '../sanity/sanityClient';

enum HtmlLang {
  NB = 'nb',
  NN = 'nn',
}

const hentDokumentHtml = async (
  dokumentVariabler: IDokumentVariabler,
  maalform: Maalform,
  dokumentId: string,
  datasett: Datasett,
): Promise<string> => {
  const tittel = (
    await client(datasett).fetch(`*[_type == "dokumentmal" && id == "${dokumentId}" ][].id`)
  )[0];

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
              navn={dokumentVariabler.flettefelter.navn}
              fodselsnr={dokumentVariabler.flettefelter.fodselsnummer}
            />
            <Dokument
              dokumentId={dokumentId}
              dokumentVariabler={dokumentVariabler}
              maalform={maalform}
              erDokumentmal={true}
              datasett={datasett}
            />
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

export default hentDokumentHtml;
