import React from 'react';
import { Medlemskapsgrunnlag } from './Medlemskapsgrunnlag.js';
import { LovligOppholdGrunnlag } from './LovligOppholdGrunnlag.js';
import { SivilstandGrunnlag } from './Sivilstand.js';
import { SamlivGrunnlag } from './Samliv.js';
import { MorEllerFarGrunnlag } from './MorEllerFarGrunnlag.js';
import { AleneomsorgGrunnlag } from './AleneomsorgGrunnlag.js';
import { NyttBarnSammePartner } from './NyttBarnSammePartner.js';
import { SagtOppEllerRedusertGrunnlag } from './SagtOppEllerRedusertGrunnlag.js';
import { AlderPåBarnGrunnlag } from './AlderPåBarnGrunnlag.js';
import { TidligereHistorikk } from './TidligereHistorikk.js';
import type {
  IVilkårGrunnlag,
  ITidligereVedtaksperioder,
  EStønadType,
} from '../../../typer/dokumentApiBlankett.js';
import { EStønadType as StønadType } from '../../../typer/dokumentApiBlankett.js';
import { VilkårGruppe, Vilkår } from '../../../typer/dokumentApiBlankett.js';
import { InntektGrunnlag } from './InntektGrunnlag.js';

export interface RegistergrunnlagForVilkårProps {
  grunnlag: IVilkårGrunnlag;
  vilkårgruppe: string;
  barnId?: string;
  tidligereVedtaksperioder?: ITidligereVedtaksperioder;
  stønadstype: EStønadType;
  erRegelendring2026: boolean;
  regelendring2026Begrunnelse?: string;
}

export const RegistergrunnlagForVilkår: React.FC<RegistergrunnlagForVilkårProps> = ({
  grunnlag,
  vilkårgruppe,
  barnId,
  tidligereVedtaksperioder,
  stønadstype,
  erRegelendring2026,
  regelendring2026Begrunnelse,
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
      return (
        <AleneomsorgGrunnlag
          barnMedSamvær={grunnlag.barnMedSamvær}
          barnId={barnId}
          personalia={grunnlag.personalia}
        />
      );
    case VilkårGruppe.ALDER_PÅ_BARN:
      return <AlderPåBarnGrunnlag barnMedSamvær={grunnlag.barnMedSamvær} barnId={barnId} />;
    case VilkårGruppe.NYTT_BARN_SAMME_PARTNER:
      return <NyttBarnSammePartner barnMedSamvær={grunnlag.barnMedSamvær} />;
    case Vilkår.TIDLIGERE_VEDTAKSPERIODER:
      return (
        <TidligereHistorikk
          tidligereVedtaksperioder={tidligereVedtaksperioder}
          erRegelendring2026={erRegelendring2026}
          regelendring2026Begrunnelse={regelendring2026Begrunnelse}
          stønadstype={stønadstype}
        />
      );
    case Vilkår.INNTEKT:
    case VilkårGruppe.RETT_TIL_OVERGANGSSTØNAD:
      if (stønadstype !== StønadType.OVERGANGSSTØNAD) {
        return (
          <InntektGrunnlag
            tidligereVedtaksperioder={tidligereVedtaksperioder}
            stønadstype={stønadstype}
          />
        );
      }
      break;
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
