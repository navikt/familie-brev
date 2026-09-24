import React from 'react';
import type { IVurdering } from '../../../typer/dokumentApiBlankett.js';
import {
  Vilkårsresultat,
  Vilkår,
  resultatTilTekst,
  delvilkårTypeTilTekst,
  svarIdTilTekst,
} from '../../../typer/dokumentApiBlankett.js';
import { IkkeOppfylt } from '../../components/ikoner/IkkeOppfylt.js';
import { IkkeVurdert } from '../../components/ikoner/IkkeVurdert.js';
import { InfoIkon } from '../../components/ikoner/InfoIkon.js';
import { OppfyltIkon } from '../../components/ikoner/OppfyltIkon.js';

interface Props {
  vurdering: IVurdering;
}

const resultatIkon = (resultat: Vilkårsresultat) => {
  switch (resultat) {
    case Vilkårsresultat.OPPFYLT || Vilkårsresultat.AUTOMATISK_OPPFYLT:
      return <OppfyltIkon heigth={24} width={24} />;
    case Vilkårsresultat.IKKE_OPPFYLT:
      return <IkkeOppfylt heigth={24} width={24} />;
    case Vilkårsresultat.SKAL_IKKE_VURDERES:
      return <InfoIkon heigth={24} width={24} />;
    default:
      return <IkkeVurdert heigth={24} width={24} />;
  }
};

export const Vilkårsvurdering: React.FC<Props> = ({ vurdering }) => {
  const resultat =
    vurdering.vilkårType === Vilkår.TIDLIGERE_VEDTAKSPERIODER
      ? Vilkårsresultat.OPPFYLT
      : vurdering.resultat;
  return (
    <>
      <div className={'blankett-vilkårsresultat'}>
        <strong>Vilkårsvurdering</strong>: {resultatTilTekst[resultat]}{' '}
        <div className={'blankett-vilkårsresultat-ikon'}>
          <span style={{ paddingBottom: '20%' }}>{resultatIkon(resultat)}</span>
        </div>
      </div>

      {vurdering.delvilkårsvurderinger
        .filter(
          delvilkårsvurderinger => delvilkårsvurderinger.resultat !== Vilkårsresultat.IKKE_AKTUELL,
        )
        .map((delvilkårsvurderinger, i) => {
          return (
            <div className={'blankett-delvilkår'} key={i}>
              <span>
                <strong>Delvurdering:</strong> {resultatTilTekst[delvilkårsvurderinger.resultat]}
              </span>
              {delvilkårsvurderinger.vurderinger.map((delvilkår, subIndex) => {
                return (
                  <div className={'blankett-delvilkår'} key={subIndex}>
                    <div>
                      {delvilkårTypeTilTekst[delvilkår.regelId]}{' '}
                      {delvilkår.svar ? svarIdTilTekst[delvilkår.svar] : 'Ikke besvart'}
                    </div>
                    {delvilkår.begrunnelse && (
                      <div>
                        Begrunnelse:{' '}
                        <p style={{ whiteSpace: 'pre-wrap' }}>{delvilkår.begrunnelse}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
    </>
  );
};
