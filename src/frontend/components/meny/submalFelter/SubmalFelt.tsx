import { CheckboksPanel } from 'nav-frontend-skjema';
import MenyVariabler from '../MenyVariabler';
import React, { useState } from 'react';
import { IDokumentVariabler } from '../../../../server/sanity/DokumentVariabler';
import { camelCaseTilVanligTekst } from '../../../utils/camelCaseTilVanligTekst';

interface SubmalFeltProps {
  submal: IDokumentVariabler | boolean | undefined;
  navn: string;
  endreSubmalIDokumentVariabler: (
    submalNavn: string,
    subfelt: IDokumentVariabler | boolean | undefined,
  ) => void;
  betingelse?: string | undefined;
}

function SubmalFelt(props: SubmalFeltProps) {
  const { navn, submal, endreSubmalIDokumentVariabler, betingelse } = props;
  const [tempDokumentVariabler, settTempDokumentVariabler] = useState(submal);

  const toggleSubmal = () => {
    let nySubmal;
    if (typeof submal === 'boolean') {
      nySubmal = !submal;
    } else {
      submal ? (nySubmal = undefined) : (nySubmal = tempDokumentVariabler);
    }

    endreSubmalIDokumentVariabler(navn, nySubmal);
  };

  const endreSubmalVariabler = (subfeltVariabler: IDokumentVariabler) => {
    settTempDokumentVariabler(subfeltVariabler);
    endreSubmalIDokumentVariabler(navn, subfeltVariabler);
  };

  if (typeof submal !== 'boolean') {
    return (
      <>
        {betingelse && (
          <CheckboksPanel
            onChange={toggleSubmal}
            checked={!!submal}
            label={camelCaseTilVanligTekst(betingelse)}
          />
        )}
        {submal && <MenyVariabler settVariabler={endreSubmalVariabler} variabler={submal} />}
      </>
    );
  }

  return <CheckboksPanel onChange={toggleSubmal} checked={submal} label={betingelse} />;
}

export default SubmalFelt;
