import React, { useEffect, useState } from "react";
import { client } from "../utils/sanity";
import Testgrensesnitt from "../utils/Testgrensesnitt";
import styled from 'styled-components';
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
}

function Dokument(dokumentProps: DokumentProps) {
  const { dokumentNavn } = dokumentProps;

  const [dokument, setDokument] = useState<any>();
  const [tittel, setTittel] = useState<string>("");
  const [grensesnitt, setGrensesnitt] = useState<any>("");

  const flettefeltSerializer = (props: any) => {
    const annontering = props.mark.felt.felt;
    // @ts-ignore
    return Testgrensesnitt.innvilget.flettefelter[annontering] || <h2>overskrift</h2>;
  };

  const skalMedDersomSerializer = (props: any) => {
    const skalMedAnnontering = props.mark.skalMedFelt.felt;
    // @ts-ignore
    if (Testgrensesnitt.innvilget.skalMedFelter[skalMedAnnontering]) {
      return props.children;
    } else {
      return "";
    }
  };

  useEffect(() => {
    const query = `*[_type == "dokumentmal" ][0]{..., innhold[]{..., markDefs[]{..., felt->, skalMedFelt->}}}`;
    client.fetch(query).then((res: any) => {
      setDokument(res.innhold);
      setTittel(res.tittel);
      // @ts-ignore
      setGrensesnitt(Testgrensesnitt[dokumentNavn.toLocaleLowerCase()]);
    });
  }, [dokumentNavn]);

  console.log("dok", dokument)

  console.log(tittel);
  return (
    <StyledBrev>
      <h1>{tittel}</h1>
      {dokument && (
        <BlockContent
          blocks={dokument}
          serializers={{
            marks: {
              flettefelt: flettefeltSerializer,
              skalMedDersom: skalMedDersomSerializer,
            },
          }}
        />
      )}
    </StyledBrev>
  );
}

export default Dokument;
