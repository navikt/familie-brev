import React from 'react';
import type { IPeriode } from '../../../../typer/dokumentApi';
import { aktivitetsTypeTilTekst, periodetypeTilTekst } from '../../../../typer/dokumentApi';
import { parseOgFormaterÅrMåned } from '../../../utils/util';

export const Vedtaksperioder: React.FC<{
  perioder: IPeriode[];
}> = ({ perioder }) => {
  return (
    <>
      <h3>Vedtaksperiode</h3>
      {perioder.map((periode, indeks) => {
        return (
          <div key={indeks}>
            <h4>
              Fra og med {parseOgFormaterÅrMåned(periode.årMånedFra)} til og med{' '}
              {parseOgFormaterÅrMåned(periode.årMånedTil)}
            </h4>
            <div>Periodetype: {periodetypeTilTekst[periode.periodeType]}</div>
            <div>Aktivitet: {aktivitetsTypeTilTekst[periode.aktivitet]}</div>
          </div>
        );
      })}
    </>
  );
};
