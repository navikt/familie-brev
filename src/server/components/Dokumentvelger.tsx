import React from 'react';

interface DokumentvelgerProps {
  dokumenter: string[];
  setDokumentNavn: (arg0: string) => void;
}

function Dokumentvelger(props: DokumentvelgerProps) {
  return (
    <div className="App">
      <form>
        <select name="dokument" id="dokument">
          {props.dokumenter.map(dokumentNavn => (
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
