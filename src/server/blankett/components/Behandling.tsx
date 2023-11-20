import React from 'react';
import type { IBehandling } from '../../../typer/dokumentApiBlankett';
import { behandlingÅrsakTilTekst } from '../../../typer/dokumentApiBlankett';

export const Behandling: React.FC<{ behandling: IBehandling }> = ({ behandling }) => {
  return (
    <div className={'blankett-page-break'}>
      <h3 className={'blankett'}>Behandling</h3>
      <span>
        <strong>Behandlingsårsak:</strong> {behandlingÅrsakTilTekst[behandling.årsak]}
      </span>
    </div>
  );
};
