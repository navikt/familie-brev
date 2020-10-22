import React, { useEffect, useState } from "react";
import { client } from "../utils/sanity";
import styled from 'styled-components';
import { IDokumentGrensesnitt } from "../utils/Grensesnitt";
const BlockContent = require("@sanity/block-content-to-react");

const StyledBrev = styled.div`
  margin: 5rem;
  padding: 5rem;
  width: 800px;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

interface DokumentProps {
  dokumentNavn: string;
  grensesnitt: IDokumentGrensesnitt;
}

function Dokument(dokumentProps: DokumentProps) {
  const { dokumentNavn, grensesnitt } = dokumentProps;

  const [dokument, setDokument] = useState<any>();

  const submalSerializer = (props: any) => {
    const dokumentNavn = props.node.tittel;
    return <Dokument dokumentNavn={dokumentNavn} grensesnitt={grensesnitt} />;
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

  const skalMedDersomSerializer = (props: any) => {
    const skalMedAnnontering = props.mark.skalMedFelt.felt;
    if (grensesnitt.skalMedFelter[skalMedAnnontering]) {
      return props.children;
    } else {
      return "";
    }
  };

  useEffect(() => {
    const query = `
        *[_type == "dokumentmal" && tittel == "${dokumentNavn}"][0]
        {..., innhold[]
          {
            _type == "block"=> {..., markDefs[]{..., felt->, skalMedFelt->}},
            _type == "dokumentliste" => {...}->{...,"_type": "dokumentliste"},
            _type == "submal" =>  {...}->{...,"_type": "submal"},
          }
        }
        `;
    client.fetch(query).then((res: any) => {
      setDokument(res.innhold);
    });
  }, [dokumentNavn]);


  return (
    <StyledBrev>
      {dokument && (
        <BlockContent
          blocks={dokument}
          serializers={{
            marks: {
              flettefelt: flettefeltSerializer,
              skalMedDersom: skalMedDersomSerializer,
            },
            types: {
              dokumentliste: dokumentlisteSerializer,
              submal: submalSerializer,
            },
          }}
        />
      )}
    </StyledBrev>
  );
}

export default Dokument;
