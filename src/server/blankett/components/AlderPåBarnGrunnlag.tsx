import React from 'react';
import type { IBarnMedSamvær } from '../../../typer/dokumentApiBlankett';
import { formaterNullableIsoDato } from '../../utils/util';

interface Props {
  barnMedSamvær: IBarnMedSamvær[];
  barnId?: string;
}

const navnPåBarnet = (barnMedSamvær: IBarnMedSamvær) => {
  const { søknadsgrunnlag, registergrunnlag } = barnMedSamvær;
  if (registergrunnlag.navn) {
    return registergrunnlag.navn;
  }
  if (søknadsgrunnlag.navn && søknadsgrunnlag.navn !== '') {
    return søknadsgrunnlag.navn;
  }
  return søknadsgrunnlag.erBarnetFødt ? 'Ikke utfylt' : 'Ikke født';
};

const AlderPåBarnGrunnlag: React.FC<Props> = ({ barnMedSamvær, barnId }) => {
  return (
    <>
      <h3>Registerdata</h3>
      {barnMedSamvær
        .filter(barn => barn.barnId === barnId)
        .map((barn, index) => {
          return (
            <div key={index}>
              <h4>Navn: {navnPåBarnet(barn)}</h4>
              <div>
                Fødsels eller D-nummer:{' '}
                {barn.registergrunnlag.fødselsnummer || barn.søknadsgrunnlag.fødselsnummer}
              </div>
              {barn.søknadsgrunnlag.fødselTermindato && (
                <div>
                  Fødselsdato/termindato:{' '}
                  {formaterNullableIsoDato(barn.søknadsgrunnlag.fødselTermindato)}
                </div>
              )}
            </div>
          );
        })}
    </>
  );
};

export default AlderPåBarnGrunnlag;
