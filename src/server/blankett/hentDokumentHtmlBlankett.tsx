import { renderToStaticMarkup } from 'react-dom/server';
import type { IDokumentData } from '../../typer/dokumentApiBlankett.js';
import { stønadstypeTilTekst } from '../../typer/dokumentApiBlankett.js';
import css from '../utils/css.js';
import { datoFormat } from '../utils/util.js';
import { Behandling } from './components/Behandling.js';
import { Dokument } from './components/Dokument.js';
import { Header } from './components/Header.js';
import { ÅrsakRevurdering } from './components/ÅrsakRevurdering.js';

enum HtmlLang {
    NB = 'nb',
}

export const hentDokumentHtmlBlankett = async (data: IDokumentData): Promise<string> => {
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
