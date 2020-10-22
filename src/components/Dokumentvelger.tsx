import React, { SyntheticEvent } from "react";

interface DokumentvelgerProps {
  dokumenter: string[];
  setDokumentNavn: (arg0: string) => void;
}

function Dokumentvelger(props: DokumentvelgerProps) {
  //const query = '*[_type == "dokumentmal"][0]';
  //const [dokumentNavn, setDokumentNavn] = useState("");

  return (
    <div className="App">
      <form>
        <select
          name="dokument"
          id="dokument"
          onChange={(e: SyntheticEvent<HTMLSelectElement, Event>) =>
            console.log(e.target)
          }
        >
          {props.dokumenter.map((dokumentNavn) => (
            <option key={dokumentNavn} value={dokumentNavn}>
              {dokumentNavn}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}

export default Dokumentvelger;
