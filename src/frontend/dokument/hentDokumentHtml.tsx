import * as React from "react";
import { IDokumentVariabler } from "../utils/DokumentVariabler";
import { Maalform } from "../utils/hentGrenesnittFraDokument";
import Dokument from "../components/Dokument";
import { Datasett } from "../utils/sanity";
import { renderToStaticMarkup } from "react-dom/server";
import Context from "../utils/Context";
import css from "./css";
import Header from "../components/Header";

const hentDokumentHtml = async (
  dokumentVariabler: IDokumentVariabler,
  maalform: Maalform,
  dokumentId: string,
  datasett: Datasett,
  tittel: string
): Promise<string> => {
  const contextValue = { requests: [] };
  const asyncHtml = () => (
    <Context.Provider value={contextValue}>
      <html>
        <head>
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
          <style type="text/css">{css}</style>
        </head>
        <body className={"body"}>
          <div>
            <Header
              visLogo={true}
              tittel={tittel}
              navn={dokumentVariabler.flettefelter.navn}
              fødselsnr={dokumentVariabler.flettefelter.fodselsnummer}
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
      throw new Error("Dokumentet har en dybde på mer enn 100");
    }
    dokument = await byggDokument();
  }

  return dokument.replace(/(\r\n|\n|\r)/gm, "");
};

export default hentDokumentHtml;
