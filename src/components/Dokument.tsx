import React, { useEffect, useState } from "react";
import { client } from "../utils/sanity";
import { IDokumentGrensesnitt } from "../utils/Grensesnitt";
const BlockContent = require("@sanity/block-content-to-react");

interface DokumentProps {
  dokumentNavn: string;
  grensesnitt: IDokumentGrensesnitt;
}

function Dokument(dokumentProps: DokumentProps) {
  const { dokumentNavn, grensesnitt } = dokumentProps;

  const [dokument, setDokument] = useState<any>();

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

  useEffect(() => {
    const query = `
        *[_type == "dokumentmal" && tittel == "${dokumentNavn}"][0]
        {..., innhold[]
          {
            _type == "block"=> {..., markDefs[]{..., felt->, skalMedFelt->, submal->}},
            _type == "dokumentliste" => {...}->{...,"_type": "dokumentliste"},
          }
        }
        `;
    client.fetch(query).then((res: any) => {
      setDokument(res.innhold);
    });
  }, [dokumentNavn]);

  return (
    <div>
      {dokument && (
        <BlockContent
          blocks={dokument}
          serializers={{
            marks: {
              flettefelt: flettefeltSerializer,
              submal: submalSerializer,
            },
            types: {
              dokumentliste: dokumentlisteSerializer,
            },
            listItem: listItemSerializer,
          }}
        />
      )}
    </div>
  );
}

export default Dokument;
