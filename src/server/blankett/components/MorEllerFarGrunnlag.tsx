import React from 'react';
import type { IBarnMedSamvær } from '../../../typer/dokumentApiBlankett';

interface Props {
  barnMedSamvær: IBarnMedSamvær[];
}

export const MorEllerFarGrunnlag: React.FC<Props> = ({ barnMedSamvær }) => {
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
            </div>
          );
        })}
    </>
  );
};
