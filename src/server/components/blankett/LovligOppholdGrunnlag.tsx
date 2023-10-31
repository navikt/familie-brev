import React from 'react';
import type { IMedlemskap } from '../../../typer/dokumentApi';
import { formaterNullableIsoDato } from '../../utils/util';

interface Props {
  medlemskap: IMedlemskap;
}

const LovligOppholdGrunnlag: React.FC<Props> = ({ medlemskap }) => {
  return (
    <>
      <h3>Registerdata</h3>
      <div>Personstatus: {medlemskap.registergrunnlag.folkeregisterpersonstatus}</div>
      <div>Statsborgerskap: {medlemskap.registergrunnlag.nåværendeStatsborgerskap.join(', ')}</div>

      <div>
        Oppholdstatus:{' '}
        {medlemskap.registergrunnlag.oppholdstatus.length === 0
          ? 'Ingen data'
          : medlemskap.registergrunnlag.oppholdstatus.map((oppholdstatus, i) => {
              return (
                <div key={i}>
                  Fra: {formaterNullableIsoDato(oppholdstatus.fraDato) || 'Ikke angitt'} | Til:{' '}
                  {formaterNullableIsoDato(oppholdstatus.tilDato) || 'Ikke angitt'} |
                  Oppholdsstatus: {oppholdstatus.oppholdstillatelse}
                </div>
              );
            })}
      </div>
      <div>
        Innflytting til Norge:{' '}
        {medlemskap.registergrunnlag.innflytting.length === 0
          ? 'Ingen data'
          : medlemskap.registergrunnlag.innflytting.map((innflytting, i) => {
              return (
                <div key={i}>
                  Dato: {formaterNullableIsoDato(innflytting.dato) || 'Ikke angitt'} | Fra:{' '}
                  {innflytting.fraflyttingsland || 'Ikke angitt'}, {innflytting.fraflyttingssted}
                </div>
              );
            })}
      </div>
      <div>
        Utflytting fra Norge:{' '}
        {medlemskap.registergrunnlag.utflytting.length === 0
          ? 'Ingen data'
          : medlemskap.registergrunnlag.utflytting.map((utflytting, i) => {
              return (
                <div key={i}>
                  Dato: {formaterNullableIsoDato(utflytting.dato) || 'Ikke angitt'} | Til:{' '}
                  {utflytting.tilflyttingsland || 'Ikke angitt'}, {utflytting.tilflyttingssted}
                </div>
              );
            })}
      </div>
    </>
  );
};

export default LovligOppholdGrunnlag;
