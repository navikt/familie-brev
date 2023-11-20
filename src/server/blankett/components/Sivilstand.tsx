import React from 'react';
import type { ISivilstandVilkår } from '../../../typer/dokumentApiBlankett';
import { sivilstandTilTekst } from '../../../typer/dokumentApiBlankett';
import { formaterNullableIsoDato } from '../../utils/util';

interface Props {
  sivilstand: ISivilstandVilkår;
}

const SivilstandGrunnlag: React.FC<Props> = ({ sivilstand }) => {
  const registergrunnlag = sivilstand.registergrunnlag;
  return (
    <>
      <h3>Registerdata</h3>
      <div>
        Sivilstatus: {sivilstandTilTekst[registergrunnlag.type]}
        {registergrunnlag.navn && ` - ${registergrunnlag.navn}`}
      </div>
      <div>Gyldig fra og med: {formaterNullableIsoDato(registergrunnlag.gyldigFraOgMed)}</div>
    </>
  );
};

export default SivilstandGrunnlag;
