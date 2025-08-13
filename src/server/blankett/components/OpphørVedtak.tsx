import React from 'react';
import { IOpphørVedtak } from '../../../typer/dokumentApiBlankett';
import { parseOgFormaterÅrMåned } from '../../utils/util';

export const OpphørVedtak: React.FC<IOpphørVedtak> = ({ opphørFom, begrunnelse }) => {
  return (
    <div className={'blankett-page-break'}>
      <h2>Vedtak</h2>
      <h3 className={'blankett'}>Resultat</h3>
      <div>Opphørt</div>
      <h4 className={'blankett'}>Opphør fra og med:</h4>
      <p>{parseOgFormaterÅrMåned(opphørFom)}</p>
      <h4 className={'blankett'}>Begrunnelse</h4>
      <p style={{ whiteSpace: 'pre-wrap' }}>{begrunnelse}</p>
    </div>
  );
};
