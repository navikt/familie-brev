import React from 'react';

interface InntektProps {
  forventetInntekt: number;
  næringsinntekt: number;
  personinntekt: number;
  årstall: number;
}

export function Inntekt(props: InntektProps) {
  const { forventetInntekt, næringsinntekt, personinntekt, årstall } = props;
  return (
    <div>
      <p>
        Bruker har mottatt stønad etter redusert FI på {forventetInntekt} i {årstall}
      </p>
      <p>
        Bruker har hatt næringsinntekt på {næringsinntekt} og personsinntekt på {personinntekt} i{' '}
        {årstall}. Inntekten har ikke økt. Bruker oppfyller aktivitetskrav som følge av høy nok
        inntekt, og det trengs ikke hentes inn dokumentasjon rundt aktivitet.
      </p>
    </div>
  );
}
