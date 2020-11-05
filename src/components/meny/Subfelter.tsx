import { IDokumentVariabler, ISubmal } from "../../utils/DokumentVariabler";
import { CheckboksPanel } from "nav-frontend-skjema";
import React, { Dispatch, SetStateAction } from "react";

export function useSubfelter(
  dokumentVariabler: IDokumentVariabler,
  settDokumentVariabler: Dispatch<
    SetStateAction<IDokumentVariabler | undefined>
  >
) {
  function endreSubfelt(
    submalNavn: string,
    subfelt: ISubmal
  ): IDokumentVariabler {
    dokumentVariabler.submaler[submalNavn] = subfelt;
    return {
      ...dokumentVariabler,
      submaler: { ...dokumentVariabler.submaler, [submalNavn]: subfelt },
    };
  }

  function Subfelt(props: { submal: ISubmal; navn: string }) {
    const { navn, submal } = props;
    if (submal.skalMedBetingelseNavn) {
      const toggleSubmal = () => {
        const nyeDokumentVariabler = endreSubfelt(navn, {
          ...submal,
          skalMed: !submal.skalMed,
        });
        settDokumentVariabler(nyeDokumentVariabler);
      };

      return (
        <CheckboksPanel
          onChange={toggleSubmal}
          checked={submal.skalMed}
          label={submal.skalMedBetingelseNavn}
        />
      );
    }
    return null;
  }

  function Subfelter() {
    const { submaler } = dokumentVariabler;
    return (
      <div className="meny-element">
        {Object.keys(submaler).map(
          (submalNavn) =>
            submaler[submalNavn].skalMedBetingelseNavn && (
              <Subfelt submal={submaler[submalNavn]} navn={submalNavn} />
            )
        )}
      </div>
    );
  }

  return Subfelter;
}
