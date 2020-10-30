import React, { useEffect, useState } from "react";
import { client } from "../utils/sanity";
import styled from 'styled-components';
import { IDokumentGrensesnitt } from "../utils/Grensesnitt";
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
  grensesnitt: IDokumentGrensesnitt;
}

function Dokument(dokumentProps: DokumentProps) {
  const { dokumentNavn, grensesnitt } = dokumentProps;

  const [dokument, setDokument] = useState<any>();
  const [tittel, setTittel] = useState<string>("");

  const listItemSerializer = (props: any) => {
    const skalMed = props.node.markDefs?.reduce(
      (acc: boolean, markDef: any) =>
        acc ||
        !markDef.skalMedFelt ||
        grensesnitt.skalMedFelter[markDef.skalMedFelt.felt],
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
    const skalMed =
      !props.mark.skalMedFelt ||
      grensesnitt.skalMedFelter[props.mark.skalMedFelt.felt];

    const dokumentNavn = props.mark.submal.tittel;
    if (skalMed) {
      return <Dokument dokumentNavn={dokumentNavn} grensesnitt={grensesnitt} />;
    } else {
      return "";
    }
  };

  const dokumentlisteSerializer = (props: any) => {
    const dokumentNavn = props.node.tittel;
    const grensesnittListe = grensesnitt.lister[dokumentNavn];

    return (
      <div>
        {grensesnittListe.map((grensesnitt) => (
          <Dokument
            key={JSON.stringify(grensesnitt)}
            dokumentNavn={dokumentNavn}
            grensesnitt={grensesnitt}
          />
        ))}
      </div>
    );
  };

  const flettefeltSerializer = (props: any) => {
    const annontering = props.mark.felt.felt;
    if (!grensesnitt.flettefelter[annontering]) {
      throw Error(`${annontering} finnes ikke i grensesnittet`);
    }
    return grensesnitt.flettefelter[annontering];
  };

  const valgfeltSerializer = (props: any) => {
    const valgfelt = props.mark.valgfelt;
    const annontering = valgfelt.tittel;
    const riktigValg = grensesnitt.valgfelter[annontering];
    const muligeValg = valgfelt.valg;
    const riktigDokument = muligeValg.find(
      (valg: any) => valg.valgmulighet === riktigValg
    );
    const dokumentnavn = riktigDokument?.dokumentmal?.tittel;
    if (dokumentnavn) {
      return (
        <div style={{ display: "inline-block" }}>
          <Dokument dokumentNavn={dokumentnavn} grensesnitt={grensesnitt} />
        </div>
      );
    } else {
      return "";
    }
  };

  useEffect(() => {
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
      <Header tittel={tittel} navn="Test" fødselsnr="12345678901" />
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
