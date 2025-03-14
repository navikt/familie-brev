import * as React from 'react';
import type { IBrevMedSignatur } from '../typer/dokumentApiBrev';
import { AvansertDokument } from './components/AvansertDokument';
import type { Datasett } from './sanity/sanityClient';
import { client } from './sanity/sanityClient';
import { renderToStaticMarkup } from 'react-dom/server';
import { Context } from './utils/Context';
import css from './utils/css';
import { Header } from './components/Header';
import { Maalform } from '../typer/sanitygrensesnitt';
import { DokumentType } from '../typer/dokumentType';
import { dagensDatoFormatert } from './utils/util';

enum HtmlLang {
  NB = 'nb',
  NN = 'nn',
}

export const hentAvansertDokumentHtml = async (
  brevMedSignatur: IBrevMedSignatur,
  maalform: Maalform,
  dokumentApiNavn: string,
  datasett: Datasett,
): Promise<string> => {
  const tittelQuery = `*[_type == "dokumentmal" && apiNavn == "${dokumentApiNavn}" ][].tittel${
    maalform === Maalform.NB ? 'Bokmaal' : 'Nynorsk'
  }`;
  const tittel = (await client(datasett).fetch(tittelQuery))[0];

  const {
    brevFraSaksbehandler: dokumentVariabler,
    besluttersignatur,
    saksbehandlersignatur,
    enhet,
    skjulBeslutterSignatur,
    datoPlaceholder,
  } = brevMedSignatur;

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
              brevOpprettetDato={[dagensDatoFormatert()]}
              maalform={maalform}
              datoPlaceholder={datoPlaceholder}
            />
            <AvansertDokument
              apiNavn={dokumentApiNavn}
              avanserteDokumentVariabler={dokumentVariabler}
              maalform={maalform}
              dokumentType={DokumentType.DOKUMENTMAL}
              datasett={datasett}
            />
            <div>
              <div>{enhet || 'Nav arbeid og ytelser'}</div>
              <p style={{ float: 'left' }}>
                {!skjulBeslutterSignatur && (
                  <>
                    <span style={{ marginRight: '70px' }}>{besluttersignatur?.trim()}</span>
                  </>
                )}
                <span>{saksbehandlersignatur}</span>
              </p>
            </div>
          </div>
        </body>
      </html>
    </Context.Provider>
  );

  async function byggDokumentAsynkront() {
    const html = renderToStaticMarkup(asyncHtml());
    await Promise.all(contextValue.requests);
    return html;
  }

  /* Følger denne guiden:
   * https://medium.com/swlh/how-to-use-useeffect-on-server-side-654932c51b13
   *
   * Resultatet fra eksterne kall blir lagret i konteksten slik at man kan bruke asynkrone funksjoner med serverside rendering.
   *
   * Når man kjører byggDokumentAsynkront flere ganger vil dokumentene og underdokumentene til alt er hentet fra Sanity.
   */
  let i = 0;
  let dokument = await byggDokumentAsynkront();
  while (dokument !== (await byggDokumentAsynkront())) {
    if (i++ >= 100) {
      throw new Error('Dokumentet har en dybde på mer enn 100');
    }
    dokument = await byggDokumentAsynkront();
  }

  return dokument;
};
