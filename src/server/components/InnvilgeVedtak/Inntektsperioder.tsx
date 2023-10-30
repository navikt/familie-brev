import React from 'react';
import type { IInntekt } from '../../../typer/dokumentApi';
import { formaterBeløp, parseOgFormaterÅrMåned } from '../../utils/util';

export const Inntektsperioder: React.FC<{
  inntekter: IInntekt[];
}> = ({ inntekter }) => {
  return (
    <>
      <h3>Inntekt</h3>
      {inntekter.map((inntekt, indeks) => {
        return (
          <div key={indeks}>
            <h4>Fra og med {parseOgFormaterÅrMåned(inntekt.årMånedFra)}</h4>
            <div>Dagsats: {formaterBeløp(inntekt.dagsats || 0)}</div>
            <div>Månedsinntekt: {formaterBeløp(inntekt.månedsinntekt || 0)}</div>
            <div>Forventet inntekt (år): {formaterBeløp(inntekt.forventetInntekt || 0)}</div>
            <div>Samordningsfradrag (mnd): {formaterBeløp(inntekt.samordningsfradrag || 0)}</div>
          </div>
        );
      })}
    </>
  );
};
