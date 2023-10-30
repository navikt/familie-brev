import type { IAnnenForelder } from '../../typer/dokumentApi';
import React from 'react';
import { formaterNullableIsoDato } from '../utils/util';

interface AnnenForelderProps {
  annenForelder?: IAnnenForelder;
  erRegisterOpplysning?: boolean;
}

const AnnenForelder: React.FC<AnnenForelderProps> = ({
  annenForelder,
  erRegisterOpplysning = true,
}) => {
  if (!annenForelder) {
    if (erRegisterOpplysning) {
      return <div>Annen forelder ikke funnet i registeropplysninger</div>;
    }
    return <div>Annen forelder ikke funnet i søknadopplysninger</div>;
  }
  return (
    <div>
      <div>Annen forelder navn: {annenForelder.navn}</div>
      <div>Annen forelder fødsels eller D-nummer: {annenForelder.fødselsnummer}</div>
      {annenForelder.fødselsdato && (
        <div>Annen forelder fødselsdato: {formaterNullableIsoDato(annenForelder.fødselsdato)}</div>
      )}
      <div>Annen forelder bor i: {annenForelder.bosattINorge ? 'Norge' : '-'}</div>
    </div>
  );
};

export default AnnenForelder;
