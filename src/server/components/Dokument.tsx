import React from 'react';
import { IDokumentVariabler } from '../sanity/DokumentVariabler';
import hentDokumentQuery from '../sanity/hentDokumentQuery';
import { Maalform } from '../sanity/hentGrenesnittFraDokument';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../dokument/useServerEffect';
import formaterTilCamelCase from '../sanity/formaterTilCamelCase';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface DokumentProps {
  dokumentId: string;
  dokumentVariabler: IDokumentVariabler;
  maalform: Maalform;
  erDokumentmal?: boolean;
  datasett: Datasett;
}

function Dokument(dokumentProps: DokumentProps) {
  const {
    dokumentId,
    dokumentVariabler,
    maalform,
    erDokumentmal = false,
    datasett,
  } = dokumentProps;
  const dokumentType = erDokumentmal ? 'dokumentmal' : 'delmal';

  const [dokument] = useServerEffect(undefined, dokumentId, () => {
    const query = hentDokumentQuery(dokumentType, dokumentId, maalform);
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        return res[maalform];
      });
  });

  const listItemSerializer = (props: any) => {
    const erSubmal = (markDef: any) => markDef._type === 'submal';
    const submalSkalMed = (mark: any): boolean =>
      !mark.skalMedFelt || !!dokumentVariabler.submaler[formaterTilCamelCase(mark.submal?.id)];

    const erKunText = props.node.markDefs.length === 0;

    const markDefSkalMed = props.node.markDefs?.reduce(
      (acc: boolean, markDef: any) => acc || !erSubmal(markDef) || submalSkalMed(markDef),
      false,
    );

    if (erKunText) {
      return <li>{props.children}</li>;
    } else if (markDefSkalMed) {
      return (
        <BlockContent
          blocks={{ ...props.node, level: undefined, listItem: undefined }}
          serializers={{
            marks: {
              flettefelt: flettefeltSerializer,
              submal: submalSerializer,
              valgfelt: valgfeltSerializer,
            },
            types: {
              dokumentliste: dokumentlisteSerializer,
              block: (props: any) => <li className={`block`}>{props.children}</li>,
            },
          }}
        />
      );
    } else {
      return '';
    }
  };

  const submalSerializer = (props: any) => {
    const dokumentId = props.mark.submal.id;

    const submalSkalMed =
      !props.mark.skalMedFelt || !!dokumentVariabler.submaler[formaterTilCamelCase(dokumentId)];

    const submalVariabler = dokumentVariabler.submaler[formaterTilCamelCase(dokumentId)];
    const variabler = typeof submalVariabler === 'object' ? submalVariabler : dokumentVariabler;

    if (submalSkalMed) {
      return (
        <div className={'delmal'}>
          <Dokument
            dokumentId={dokumentId}
            dokumentVariabler={variabler}
            maalform={maalform}
            datasett={datasett}
          />
        </div>
      );
    } else {
      return '';
    }
  };

  const dokumentlisteSerializer = (props: any) => {
    const dokumentId = props.node.id;
    const dokumentVariablerListe = dokumentVariabler.lister[formaterTilCamelCase(dokumentId)];

    return (
      <div className={'dokumentListe'}>
        {dokumentVariablerListe.map((dokumentVariabler, index) => (
          <div key={JSON.stringify(`dokumentVariabler${index}`)} className={'dokumentListe'}>
            <Dokument
              dokumentId={dokumentId}
              dokumentVariabler={dokumentVariabler}
              maalform={maalform}
              datasett={datasett}
            />
          </div>
        ))}
      </div>
    );
  };

  const flettefeltSerializer = (props: any) => {
    const annontering = props.mark.felt.felt;
    if (!dokumentVariabler.flettefelter[formaterTilCamelCase(annontering)]) {
      throw Error(`${annontering} finnes ikke blant dokumentvariablene`);
    }
    return dokumentVariabler.flettefelter[formaterTilCamelCase(annontering)];
  };

  const valgfeltSerializer = (props: any) => {
    const valgfelt = props.mark.valgfelt;
    const valgFeltNavn = valgfelt.id;
    const riktigValg = dokumentVariabler.valgfelter[formaterTilCamelCase(valgFeltNavn)].valgNavn;
    const muligeValg = valgfelt.valg;
    const riktigDokument = muligeValg.find((valg: any) => valg.valgmulighet === riktigValg);
    const dokumentId = riktigDokument?.delmal?.id;
    const valgVariabler =
      dokumentVariabler.valgfelter[formaterTilCamelCase(valgFeltNavn)].valgVariabler;
    const variabler = valgVariabler ? valgVariabler : dokumentVariabler;

    if (dokumentId) {
      return (
        <div className={'valgfelt inline'}>
          <Dokument
            dokumentId={dokumentId}
            dokumentVariabler={variabler}
            maalform={maalform}
            datasett={datasett}
          />
        </div>
      );
    } else {
      console.warn(`Fant ikke dokument med tilhørende ${riktigValg}`);
      return '';
    }
  };

  if (!dokument) {
    return null;
  }

  return (
    <BlockContent
      blocks={dokument}
      serializers={{
        marks: {
          flettefelt: flettefeltSerializer,
          submal: submalSerializer,
          valgfelt: valgfeltSerializer,
        },
        types: {
          dokumentliste: dokumentlisteSerializer,
          block: (props: any) => <div className={`block`}>{props.children}</div>,
        },
        listItem: listItemSerializer,
      }}
    />
  );
}

export default Dokument;
