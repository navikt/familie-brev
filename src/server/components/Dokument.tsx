import React from "react";
import { IDokumentVariabler } from "../sanity/DokumentVariabler";
import hentDokumentQuery from "../sanity/hentDokumentQuery";
import { Maalform } from "../sanity/hentGrenesnittFraDokument";
import { client, Datasett } from "../sanity/sanityClient";
import useServerEffect from "../dokument/useServerEffect";

const BlockContent = require("@sanity/block-content-to-react");

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
  const dokumentType = erDokumentmal ? "dokumentmal" : "delmal";

  const [dokument] = useServerEffect(undefined, dokumentId, () => {
    const query = hentDokumentQuery(dokumentType, dokumentId, maalform);
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        return res[maalform];
      });
  });

  const listItemSerializer = (props: any) => {
    const erSubmal = (markDef: any) => markDef._type === "submal";
    const submalSkalMed = (submal: any): boolean => {
      const id = submal?.id;
      return !!dokumentVariabler.submaler[id]?.skalMed;
    };

    const erKunText = props.node.markDefs.length === 0;

    const markDefSkalMed = props.node.markDefs?.reduce(
      (acc: boolean, markDef: any) =>
        acc || !erSubmal(markDef) || submalSkalMed(markDef.submal),
      false
    );

    const BlockContentWithoutListItemSerialazer = () => (
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
            block: (props: any) => (
              <li className={`block`}>{props.children}</li>
            ),
          },
        }}
      />
    );

    if (erKunText) {
      return <li>{props.children}</li>;
    } else if (markDefSkalMed) {
      return BlockContentWithoutListItemSerialazer();
    } else {
      return "";
    }
  };

  const submalSerializer = (props: any) => {
    const dokumentId = props.mark.submal.id;

    const skalMed = dokumentVariabler.submaler[dokumentId]?.skalMed;

    const submalVariabler =
      dokumentVariabler.submaler[dokumentId]?.submalVariabler;
    const variabler = submalVariabler ? submalVariabler : dokumentVariabler;

    if (skalMed) {
      return (
        <div className={"delmal inline"}>
          <Dokument
            dokumentId={dokumentId}
            dokumentVariabler={variabler}
            maalform={maalform}
            datasett={datasett}
          />
        </div>
      );
    } else {
      return "";
    }
  };

  const dokumentlisteSerializer = (props: any) => {
    const dokumentId = props.node.id;
    const dokumentVariablerListe = dokumentVariabler.lister[dokumentId];

    return (
      <div className={"dokumentListe"}>
        {dokumentVariablerListe.map((dokumentVariabler, index) => (
          <div
            key={JSON.stringify(`dokumentVariabler${index}`)}
            className={"dokumentListe"}
          >
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
    if (!dokumentVariabler.flettefelter[annontering]) {
      throw Error(`${annontering} finnes ikke blant dokumentvariablene`);
    }
    return dokumentVariabler.flettefelter[annontering];
  };

  const valgfeltSerializer = (props: any) => {
    const valgfelt = props.mark.valgfelt;
    const valgFeltNavn = valgfelt.tittel;
    const riktigValg = dokumentVariabler.valgfelter[valgFeltNavn].valgNavn;
    const muligeValg = valgfelt.valg;
    const riktigDokument = muligeValg.find(
      (valg: any) => valg.valgmulighet === riktigValg
    );
    const dokumentId = riktigDokument?.delmal?.id;
    const valgVariabler =
      dokumentVariabler.valgfelter[valgFeltNavn].valgVariabler;

    if (dokumentId) {
      return (
        <div className={"valgfelt inline"}>
          <Dokument
            dokumentId={dokumentId}
            dokumentVariabler={valgVariabler}
            maalform={maalform}
            datasett={datasett}
          />
        </div>
      );
    } else {
      console.warn(`Fant ikke dokument med tilhørende ${riktigValg}`);
      return "";
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
          block: (props: any) => (
            <div className={`block`}>{props.children}</div>
          ),
        },
        listItem: listItemSerializer,
      }}
    />
  );
}

export default Dokument;
