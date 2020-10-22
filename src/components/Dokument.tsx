import React, { useEffect, useState } from "react";
import { client } from "../utils/sanity";
import Testgrensesnitt from "../utils/Testgrensesnitt";
const BlockContent = require("@sanity/block-content-to-react");

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
    return Testgrensesnitt.innvilget.flettefelter[annontering];
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
    console.log(Testgrensesnitt.innvilget);
    client.fetch(query).then((res: any) => {
      console.log(res);
      setDokument(res.innhold);
      setTittel(res.tittel);
      // @ts-ignore
      setGrensesnitt(Testgrensesnitt[dokumentNavn.toLocaleLowerCase()]);
    });
  }, [dokumentNavn]);

  console.log(tittel);
  return (
    <div>
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
    </div>
  );
}

export default Dokument;
