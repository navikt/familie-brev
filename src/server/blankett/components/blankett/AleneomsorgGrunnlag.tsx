import React from 'react';
import AnnenForelder from './AnnenForelder';
import type { IBarnMedSamvær } from '../../../../typer/dokumentApi';
import { formaterNullableIsoDato } from '../../../utils/util';

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

const bostedForBarn = (barnMedSamvær: IBarnMedSamvær) => {
  if (barnMedSamvær.registergrunnlag.harSammeAdresse === true) {
    return 'Registrert på søkers adresse';
  } else if (barnMedSamvær.registergrunnlag.harSammeAdresse === false) {
    return 'Ikke registrert på søkers adresse';
  } else {
    return 'Ukjent registeradresse';
  }
};

const AleneomsorgGrunnlag: React.FC<Props> = ({ barnMedSamvær, barnId }) => {
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
              <div>Bosted: {bostedForBarn(barn)} </div>
              <AnnenForelder annenForelder={barn.registergrunnlag.forelder} />
              <div>
                Annen forelders adresse:{' '}
                {barn.registergrunnlag?.forelder?.visningsadresse ||
                  'Mangler gjeldende bostedsadresse'}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default AleneomsorgGrunnlag;
