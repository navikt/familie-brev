import React from 'react';
import type { IÅrsakRevurdering } from '../../../typer/dokumentApiBlankett';
import {
  opplysningskildeTilTekst,
  årsakRevuderingTilTekst,
} from '../../../typer/dokumentApiBlankett';

export const ÅrsakRevurdering: React.FC<{ årsakRevurdering?: IÅrsakRevurdering }> = ({
  årsakRevurdering,
}) =>
  årsakRevurdering ? (
    <div className={'blankett-page-break'}>
      <div>
        <h3 className={'blankett'}>Årsak revurdering:</h3>
        <div>
          <strong>Årsak:</strong> {årsakRevuderingTilTekst[årsakRevurdering.årsak]}
        </div>
        <div>
          <strong>Opplysningsskilde:</strong>{' '}
          {opplysningskildeTilTekst[årsakRevurdering.opplysningskilde]}
        </div>
        {årsakRevurdering.beskrivelse && (
          <div>
            <strong>Begrunnelse:</strong> {årsakRevurdering.beskrivelse}
          </div>
        )}
      </div>
    </div>
  ) : null;
