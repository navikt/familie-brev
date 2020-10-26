import React, { useEffect, useState } from "react";
import "./App.css";
import { client } from "./utils/sanity";
import Dokument from "./components/Dokument";
import Dokumentvelger from "./components/Dokumentvelger";
import { Testgrensesnitt } from "./utils/Testgrensesnitt";

function App() {
  const [dokumenter, setDokumenter] = useState<string[]>([]);
  const [dokumentNavn, setDokumentNavn] = useState("");

  useEffect(() => {
    const query = '*[_type == "dokumentmal"][].tittel';
    client.fetch(query).then((res: any) => {
      setDokumenter(res);
      setDokumentNavn("Innvilget");
    });
  }, []);

  return (
    <div className="App">
      <Dokument
        dokumentNavn={dokumentNavn}
        grensesnitt={Testgrensesnitt[dokumentNavn]}
      />
    </div>
  );
}

export default App;
