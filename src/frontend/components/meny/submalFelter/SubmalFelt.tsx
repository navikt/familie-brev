import { CheckboksPanel } from 'nav-frontend-skjema';
import MenyVariabler from '../MenyVariabler';
import React from 'react';
import { IDokumentVariabler, ISubmalMetaData } from '../../../../server/sanity/DokumentVariabler';

interface SubmalFeltProps {
  submal: IDokumentVariabler | boolean | undefined;
  navn: string;
  endreSubmalIDokumentVariabler: Function;
  metaData?: ISubmalMetaData;
}

function SubmalFelt(props: SubmalFeltProps) {
  const { navn, submal, endreSubmalIDokumentVariabler, metaData } = props;

  if (!metaData) {
    return <div>Delmal mangler metadata</div>;
  }

  const toggleSubmal = () => {
    let nySubmal;
    if (typeof submal === 'boolean') {
      nySubmal = !submal;
    } else {
      submal ? (nySubmal = undefined) : (nySubmal = metaData.dokumentVariabler);
    }

    endreSubmalIDokumentVariabler(navn, nySubmal, metaData);
  };

  const endreSubmalVariabler = (subfeltVariabler: IDokumentVariabler) => {
    const nyMetaData = metaData;
    nyMetaData.dokumentVariabler = subfeltVariabler;

    endreSubmalIDokumentVariabler(navn, subfeltVariabler, nyMetaData);
  };

  if (typeof submal !== 'boolean') {
    return (
      <>
        {metaData.betingelse && (
          <CheckboksPanel onChange={toggleSubmal} checked={!!submal} label={metaData.betingelse} />
        )}
        {submal && <MenyVariabler settVariabler={endreSubmalVariabler} variabler={submal} />}
      </>
    );
  }

  return <CheckboksPanel onChange={toggleSubmal} checked={submal} label={metaData.betingelse} />;
}

export default SubmalFelt;
