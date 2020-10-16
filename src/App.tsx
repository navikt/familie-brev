import React, { useEffect, useState } from "react";
import "./App.css";
import { client } from "./utils/sanity";
const BlockContent = require("@sanity/block-content-to-react");

function App() {
  const [info, setInfo] = useState<any>();
  const [tittel, setTittel] = useState<string>("");

  const duFaar = {
    fom: "'PLACEHOLDER FOMDATO'",
    tom: "'PLACEHOLDER TOMDATO'",
    belop: "placeholder beløp",
    antallBarn: 3,
    barnasFodselsdatoer: "placeholder barnas fødselsdatoer",
    begrunnelser: ["INNVILGET_BOSATT_I_RIKTET"],
  };

  const variableSerializer = (props: any) => {
    // @ts-ignore
    return duFaar[props.children[0]];
  };

  const query = '*[_type == "test"][0]';

  useEffect(() => {
    client.fetch(query).then((res: any) => {
      setInfo(res.submal_block);
      setTittel(res.tittel);
    });
  }, []);
  return (
    <div className="App">
      <h1>{tittel}</h1>
      {info && (
        <BlockContent
          blocks={info}
          serializers={{
            marks: { variable: variableSerializer },
          }}
        />
      )}
    </div>
  );
}

export default App;
