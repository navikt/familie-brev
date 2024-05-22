import React from 'react';
import Medlemskapsgrunnlag from './Medlemskapsgrunnlag';
import LovligOppholdGrunnlag from './LovligOppholdGrunnlag';
import SivilstandGrunnlag from './Sivilstand';
import SamlivGrunnlag from './Samliv';
import MorEllerFarGrunnlag from './MorEllerFarGrunnlag';
import AleneomsorgGrunnlag from './AleneomsorgGrunnlag';
import NyttBarnSammePartner from './NyttBarnSammePartner';
import SagtOppEllerRedusertGrunnlag from './SagtOppEllerRedusertGrunnlag';
import AlderPåBarnGrunnlag from './AlderPåBarnGrunnlag';
import { TidligereHistorikk } from './TidligereHistorikk';
import type {
  IVilkårGrunnlag,
  ITidligereVedtaksperioder,
} from '../../../typer/dokumentApiBlankett';
import { VilkårGruppe, Vilkår } from '../../../typer/dokumentApiBlankett';
import { InntektGrunnlag } from './InntektGrunnlag';

export interface RegistergrunnlagForVilkårProps {
  grunnlag: IVilkårGrunnlag;
  vilkårgruppe: string;
  barnId?: string;
  tidligereVedtaksperioder?: ITidligereVedtaksperioder;
}

export const RegistergrunnlagForVilkår: React.FC<RegistergrunnlagForVilkårProps> = ({
  grunnlag,
  vilkårgruppe,
  barnId,
  tidligereVedtaksperioder,
}) => {
  switch (vilkårgruppe) {
    case VilkårGruppe.MEDLEMSKAP:
      return <Medlemskapsgrunnlag medlemskap={grunnlag.medlemskap} />;
    case VilkårGruppe.LOVLIG_OPPHOLD:
      return <LovligOppholdGrunnlag medlemskap={grunnlag.medlemskap} />;
    case VilkårGruppe.SIVILSTAND:
      return <SivilstandGrunnlag sivilstand={grunnlag.sivilstand} />;
    case VilkårGruppe.SAMLIV:
      return <SamlivGrunnlag />;
    case VilkårGruppe.MOR_ELLER_FAR:
      return <MorEllerFarGrunnlag barnMedSamvær={grunnlag.barnMedSamvær} />;
    case VilkårGruppe.ALENEOMSORG:
      return <AleneomsorgGrunnlag barnMedSamvær={grunnlag.barnMedSamvær} barnId={barnId} />;
    case VilkårGruppe.ALDER_PÅ_BARN:
      return <AlderPåBarnGrunnlag barnMedSamvær={grunnlag.barnMedSamvær} barnId={barnId} />;
    case VilkårGruppe.NYTT_BARN_SAMME_PARTNER:
      return <NyttBarnSammePartner barnMedSamvær={grunnlag.barnMedSamvær} />;
    case Vilkår.TIDLIGERE_VEDTAKSPERIODER:
      return <TidligereHistorikk tidligereVedtaksperioder={tidligereVedtaksperioder} />;
    case Vilkår.INNTEKT:
      return <InntektGrunnlag tidligereVedtaksperioder={tidligereVedtaksperioder} />;
    case VilkårGruppe.SAGT_OPP_ELLER_REDUSERT:
      return (
        <SagtOppEllerRedusertGrunnlag
          harAvsluttetArbeidsforhold={grunnlag.harAvsluttetArbeidsforhold}
        />
      );
    default:
      return <div />;
  }
};
