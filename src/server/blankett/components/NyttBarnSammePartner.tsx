import React from 'react';
import { AnnenForelder } from './AnnenForelder';
import type { IBarnMedSamvær } from '../../../typer/dokumentApiBlankett';

interface Props {
  barnMedSamvær: IBarnMedSamvær[];
}

export const NyttBarnSammePartner: React.FC<Props> = ({ barnMedSamvær }) => {
  return (
    <>
      <h3 className={'blankett'}>Registerdata</h3>
      {barnMedSamvær
        .filter(barn => barn.registergrunnlag.fødselsnummer)
        .map((barn, index) => {
          return (
            <div key={index}>
              <h4 className={'blankett'}>Navn: {barn.registergrunnlag.navn}</h4>
              <div>Fødsels eller D-nummer: {barn.registergrunnlag.fødselsnummer}</div>
              <h4 className={'blankett'}>Annen forelder register:</h4>
              <AnnenForelder annenForelder={barn.registergrunnlag.forelder} />
              <h4 className={'blankett'}>Annen forelder søknad:</h4>
              <AnnenForelder
                annenForelder={barn.søknadsgrunnlag.forelder}
                erRegisterOpplysning={false}
              />
            </div>
          );
        })}
    </>
  );
};
