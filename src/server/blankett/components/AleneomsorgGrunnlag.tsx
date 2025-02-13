import React from 'react';
import { AnnenForelder } from './AnnenForelder';
import {
  IBarnMedSamvær,
  IPersonalia,
  samværsandelTilVerdi,
  Samværsavtale,
  Samværsdag,
  Samværsuke,
} from '../../../typer/dokumentApiBlankett';
import { formaterNullableIsoDato } from '../../utils/util';

interface Props {
  barnMedSamvær: IBarnMedSamvær[];
  personalia: IPersonalia;
  barnId?: string;
  samværsavtaler?: Samværsavtale[]; //TODO: Fjern nullable etter at familie-ef-sak har blitt prodsatt
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

const utledBostedTekst = (harDeltBosted: boolean, harSammeAdresse: boolean | undefined) => {
  if (harDeltBosted) {
    return 'Registrert med delt bosted';
  }
  if (harSammeAdresse) {
    return 'Registrert på brukers adresse';
  }
  return 'Ikke registrert på brukers adresse';
};

export const utledVisningstekstForSamværsavtale = (samværsuker: Samværsuke[]) => {
  const summertSamvær = samværsuker
    .flatMap(samværsuke =>
      Object.values(samværsuke).flatMap((samværsdag: Samværsdag) => samværsdag.andeler),
    )
    .map(andel => samværsandelTilVerdi[andel])
    .reduce((acc, andel) => acc + andel, 0);

  const maksimalSamværsandel = samværsuker.length * 7 * 8;

  const antallHeleDagerMedSamvær = Math.floor(summertSamvær / 8);

  const rest = summertSamvær % 8;
  const restSuffix = rest === 0 ? '' : '/8';

  const prosentandel = summertSamvær / maksimalSamværsandel;

  const visningstekstAntallDager = `${antallHeleDagerMedSamvær} dager og ${rest}${restSuffix} deler`;
  const visningstekstProsentandel = `${Math.round(prosentandel * 1000) / 10}%`;
  return `Samværsandel: ${visningstekstAntallDager} = ${visningstekstProsentandel}`;
};

export const AleneomsorgGrunnlag: React.FC<Props> = ({
  barnMedSamvær,
  barnId,
  personalia,
  samværsavtaler,
}) => {
  return (
    <>
      <h3 className={'blankett'}>Registerdata</h3>
      {barnMedSamvær
        .filter(barn => barn.barnId === barnId)
        .map((barn, index) => {
          const { harSammeAdresse, harDeltBostedVedGrunnlagsdataopprettelse } =
            barn.registergrunnlag;

          const skalViseAdresser = !harDeltBostedVedGrunnlagsdataopprettelse && !harSammeAdresse;

          const samværsavtale = samværsavtaler?.find(
            samværsavtale => samværsavtale.behandlingBarnId === barnId,
          );

          return (
            <div key={index}>
              <h4 className={'blankett'}>Navn: {navnPåBarnet(barn)}</h4>
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
              <div>
                Bosted:{' '}
                {utledBostedTekst(harDeltBostedVedGrunnlagsdataopprettelse, harSammeAdresse)}{' '}
                {skalViseAdresser && <AdresseTabell barn={barn} personalia={personalia} />}
              </div>
              <AnnenForelder annenForelder={barn.registergrunnlag.forelder} />
              <div>
                Annen forelders adresse:{' '}
                {barn.registergrunnlag?.forelder?.visningsadresse ||
                  'Mangler gjeldende bostedsadresse'}
              </div>
              {samværsavtale && <div>{utledVisningstekstForSamværsavtale(samværsavtale.uker)}</div>}
            </div>
          );
        })}
    </>
  );
};

const AdresseTabell: React.FC<{ barn: IBarnMedSamvær; personalia: IPersonalia }> = ({
  barn,
  personalia,
}) => {
  return (
    <>
      <p>Bruker og barnets folkeregistrerte bostedsadresser:</p>

      <table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Adresse</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{personalia.navn.visningsnavn}</td>
            <td>{personalia.bostedsadresse?.visningsadresse}</td>
          </tr>
          <tr>
            <td>{navnPåBarnet(barn)}</td>
            <td>{barn.registergrunnlag?.adresse}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
