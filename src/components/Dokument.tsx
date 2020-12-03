import React, { useEffect, useState } from "react";
import { IDokumentVariabler } from "../utils/DokumentVariabler";
import hentDokumentQuery from "../utils/hentDokumentQuery";
import { Maalform } from "../utils/hentGrenesnittFraDokument";
import hentFraSanity from "../utils/hentFraSanity";
import { Datasett } from "../utils/sanity";
import useServerEffect from "../utils/useServerEffect";
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
    return hentFraSanity(query, datasett).then((res: any) => {
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

    const BlockContentWithoutListItemSerialazer = (blockRenderer: Function) => (
      <BlockContent
        blocks={props.children}
        serializers={{
          marks: {
            flettefelt: flettefeltSerializer,
            submal: submalSerializer,
            valgfelt: valgfeltSerializer,
          },
          types: {
            dokumentliste: dokumentlisteSerializer,
            block: { blockRenderer },
          },
        }}
      />
    );

    if (erKunText) {
      return (
        <li className={"list item"}>
          {BlockContentWithoutListItemSerialazer((props: any) => (
            <div>{props.children}</div>
          ))}
        </li>
      );
    } else if (markDefSkalMed) {
      return <li>{props.children}</li>;
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

  const innhold = (
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

  return innhold;
}

export default Dokument;
