import React from 'react';
import type { ISivilstandVilkår } from '../../../typer/dokumentApiBlankett.js';
import { sivilstandTilTekst } from '../../../typer/dokumentApiBlankett.js';
import { formaterNullableIsoDato } from '../../utils/util.js';

interface Props {
  sivilstand: ISivilstandVilkår;
}

export const SivilstandGrunnlag: React.FC<Props> = ({ sivilstand }) => {
  const registergrunnlag = sivilstand.registergrunnlag;
  return (
    <>
      <h3 className={'blankett'}>Registerdata</h3>
      <div>
        Sivilstatus: {sivilstandTilTekst[registergrunnlag.type]}
        {registergrunnlag.navn && ` - ${registergrunnlag.navn}`}
      </div>
      <div>Gyldig fra og med: {formaterNullableIsoDato(registergrunnlag.gyldigFraOgMed)}</div>
    </>
  );
};
