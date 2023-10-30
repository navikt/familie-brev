import React from 'react';
import { formaterNullableIsoDato, formaterNullableMånedÅr } from '../../utils/util';

export const Søknadsinformasjon: React.FC<{
  søknadsdato: string;
  søkerStønadFra?: string;
}> = ({ søknadsdato, søkerStønadFra }) => {
  return (
    <>
      <h3>Søknadsinformasjon</h3>
      <div>Søknadsdato: {formaterNullableIsoDato(søknadsdato)}</div>
      <div>Søker stønad fra: {formaterNullableMånedÅr(søkerStønadFra)}</div>
    </>
  );
};
