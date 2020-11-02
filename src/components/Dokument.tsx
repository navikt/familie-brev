import React, { useEffect, useState } from "react";
import { client } from "../utils/sanity";
import styled from "styled-components";
import { IDokumentVariabler } from "../utils/Grensesnitt";
import hentDokumentQuery from "../utils/hentDokumentQuery";
import Header from './Header';
const BlockContent = require("@sanity/block-content-to-react");

const StyledBrev = styled.div`
  margin: 5rem;
  padding: 5rem;
  width: 800px;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

interface DokumentProps {
  dokumentNavn: string;
  dokumentVariabler: IDokumentVariabler;
}

function Dokument(dokumentProps: DokumentProps) {
  const { dokumentNavn, dokumentVariabler } = dokumentProps;

  const { navn, fodselsnummer } = grensesnitt.flettefelter;

  const [dokument, setDokument] = useState<any>();
  const [tittel, setTittel] = useState<string>("");

  const listItemSerializer = (props: any) => {
    const erSubmal = (markDef: any) => markDef._type === "submal";
    const submalSkalMed = (submal: any): boolean => {
      const tittel = submal?.tittel;
      return !!dokumentVariabler.submaler[tittel]?.skalMed;
    };

    const skalMed = props.node.markDefs?.reduce(
      (acc: boolean, markDef: any) =>
        acc || !erSubmal || submalSkalMed(markDef.submal),
      false
    );

    if (skalMed) {
      return (
        <BlockContent
          blocks={props.node}
          serializers={{
            marks: {
              flettefelt: flettefeltSerializer,
              submal: submalSerializer,
              valgfelt: valgfeltSerializer,
            },
            types: {
              dokumentliste: dokumentlisteSerializer,
            },
          }}
        />
      );
    } else {
      return "";
    }
  };

  const submalSerializer = (props: any) => {
    const skalMedFelt = props.mark.skalMedFelt?.felt;
    const dokumentNavn = props.mark.submal.tittel;

    const skalMed = dokumentVariabler.submaler[dokumentNavn]?.skalMed;

    const submalVariabler =
      dokumentVariabler.submaler[dokumentNavn]?.submalVariabler;
    const variabler = submalVariabler ? submalVariabler : dokumentVariabler;

    if (skalMed) {
      return (
        <div style={{ display: "inline-block" }}>
          <Dokument dokumentNavn={dokumentNavn} dokumentVariabler={variabler} />
        </div>
      );
    } else {
      return "";
    }
  };

  const dokumentlisteSerializer = (props: any) => {
    const dokumentNavn = props.node.tittel;
    const dokumentVariablerListe = dokumentVariabler.lister[dokumentNavn];

    return (
      <div>
        {dokumentVariablerListe.map((dokumentVariabler) => (
          <Dokument
            key={JSON.stringify(dokumentVariabler)}
            dokumentNavn={dokumentNavn}
            dokumentVariabler={dokumentVariabler}
          />
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
    const dokumentnavn = riktigDokument?.dokumentmal?.tittel;
    const valgVariabler =
      dokumentVariabler.valgfelter[valgFeltNavn].valgVariabler;

    if (dokumentnavn) {
      return (
        <div style={{ display: "inline-block" }}>
          <Dokument
            dokumentNavn={dokumentnavn}
            dokumentVariabler={valgVariabler}
          />
        </div>
      );
    } else {
      console.warn(`Fant ikke dokument med tilhørende ${riktigValg}`);
      return "";
    }
  };

  useEffect(() => {
    const query = hentDokumentQuery(dokumentNavn);
    const query = `
        *[_type == "dokumentmal" && id == "${dokumentNavn}"][0]
        {..., innhold[]
          {
            _type == "block"=> {..., markDefs[]{
              ..., 
              felt->, 
              skalMedFelt->, 
              submal->, 
              valgfelt->{..., valg[]{..., dokumentmal->}}}
            },
            _type == "dokumentliste" => {...}->{...,"_type": "dokumentliste"},
          }
        }
        `;
    client.fetch(query).then((res: any) => {
      setDokument(res.innhold);
      setTittel(res.tittel);
    });
  }, [dokumentNavn]);

  return (
    <StyledBrev>
      <Header
        visLogo={true}
        tittel={tittel}
        navn={navn}
        fødselsnr={fodselsnummer}
      />
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
          },
          listItem: listItemSerializer,
        }}
      />
    </StyledBrev>
  );
}

export default Dokument;
