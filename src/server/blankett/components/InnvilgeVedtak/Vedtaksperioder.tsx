import React from 'react';
import type { IPeriode } from '../../../../typer/dokumentApiBlankett';
import { aktivitetsTypeTilTekst, periodetypeTilTekst } from '../../../../typer/dokumentApiBlankett';
import { parseOgFormaterÅrMåned } from '../../../utils/util';

export const Vedtaksperioder: React.FC<{
  perioder: IPeriode[];
}> = ({ perioder }) => {
  return (
    <>
      <h3 className={'blankett'}>Vedtaksperiode</h3>
      {perioder.map((periode, indeks) => {
        return (
          <div key={indeks}>
            <h4 className={'blankett'}>
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
