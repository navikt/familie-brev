import React from 'react';
import { IOpphørVedtak } from '../../../typer/dokumentApiBlankett';

export const OpphørVedtak: React.FC<IOpphørVedtak> = ({ opphørFOM, opphørBegrunnelse }) => {
  return (
    <div className={'blankett-page-break'}>
      <h2>Vedtak</h2>
      <h3 className={'blankett'}>Resultat</h3>
      <div>Opphørt</div>
      <h4 className={'blankett'}>Opphør fra og med:</h4>
      <p>{opphørFOM}</p>
      <h4 className={'blankett'}>Begrunnelse</h4>
      <p style={{ whiteSpace: 'pre-wrap' }}>{opphørBegrunnelse}</p>
    </div>
  );
};
