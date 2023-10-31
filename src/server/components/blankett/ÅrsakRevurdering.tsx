import React from 'react';
import type { IÅrsakRevurdering } from '../../../typer/dokumentApi';
import { opplysningskildeTilTekst, årsakRevuderingTilTekst } from '../../../typer/dokumentApi';

export const ÅrsakRevurdering: React.FC<{ årsakRevurdering?: IÅrsakRevurdering }> = ({
  årsakRevurdering,
}) =>
  årsakRevurdering ? (
    <div className={'page-break'}>
      <div>
        <h3>Årsak revurdering:</h3>
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
