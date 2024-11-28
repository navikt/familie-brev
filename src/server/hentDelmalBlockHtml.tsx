import * as React from 'react';
import type { IBrevMedSignatur } from '../typer/dokumentApiBrev';
import AvansertDokument from './components/AvansertDokument';
import type { Datasett } from './sanity/sanityClient';
import { renderToStaticMarkup } from 'react-dom/server';
import Context from './utils/Context';
import { Maalform } from '../typer/sanitygrensesnitt';
import { DokumentType } from '../typer/dokumentType';

export const hentDelmalblokkHtml = async (
  brevMedSignatur: IBrevMedSignatur,
  maalform: Maalform,
  delmalblokk: string,
  datasett: Datasett,
): Promise<string> => {
  const { brevFraSaksbehandler: dokumentVariabler } = brevMedSignatur;

  const contextValue = { requests: [] };
  const asyncHtml = () => (
    <Context.Provider value={contextValue}>
      <AvansertDokument
        apiNavn={delmalblokk}
        avanserteDokumentVariabler={dokumentVariabler}
        maalform={maalform}
        dokumentType={DokumentType.AVANSERT_DELMAL}
        datasett={datasett}
      />
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
