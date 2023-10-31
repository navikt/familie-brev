import React from 'react';
import Vilkårsvurdering from './Vilkårsvurdering';
import Medlemskapsgrunnlag from './Medlemskapsgrunnlag';
import LovligOppholdGrunnlag from './LovligOppholdGrunnlag';
import SivilstandGrunnlag from './Sivilstand';
import SamlivGrunnlag from './Samliv';
import MorEllerFarGrunnlag from './MorEllerFarGrunnlag';
import AleneomsorgGrunnlag from './AleneomsorgGrunnlag';
import NyttBarnSammePartner from './NyttBarnSammePartner';
import SagtOppEllerRedusertGrunnlag from './SagtOppEllerRedusertGrunnlag';
import { Vedtak } from './Vedtak';
import AlderPåBarnGrunnlag from './AlderPåBarnGrunnlag';
import { TidligereHistorikk } from './TidligereHistorikk';
import type { IDokumentData, IVurdering, IVilkårGrunnlag } from '../../../typer/dokumentApi';
import {
  VilkårGruppe,
  Vilkår,
  EBehandlingÅrsak,
  vilkårTypeTilTekst,
} from '../../../typer/dokumentApi';

interface DokumentProps {
  dokumentData: IDokumentData;
}

function gjelderDetteVilkåret(vurdering: IVurdering, vilkårgruppe: string): boolean {
  switch (vilkårgruppe) {
    case VilkårGruppe.TIDLIGERE_VEDTAKSPERIODER:
      return vurdering.vilkårType === Vilkår.TIDLIGERE_VEDTAKSPERIODER;
    case VilkårGruppe.MEDLEMSKAP:
      return vurdering.vilkårType === Vilkår.FORUTGÅENDE_MEDLEMSKAP;
    case VilkårGruppe.LOVLIG_OPPHOLD:
      return vurdering.vilkårType === Vilkår.LOVLIG_OPPHOLD;
    case VilkårGruppe.SIVILSTAND:
      return vurdering.vilkårType === Vilkår.SIVILSTAND;
    case VilkårGruppe.SAMLIV:
      return vurdering.vilkårType === Vilkår.SAMLIV;
    case VilkårGruppe.MOR_ELLER_FAR:
      return vurdering.vilkårType === Vilkår.MOR_ELLER_FAR;
    case VilkårGruppe.ALENEOMSORG:
      return vurdering.vilkårType === Vilkår.ALENEOMSORG;
    case VilkårGruppe.NYTT_BARN_SAMME_PARTNER:
      return vurdering.vilkårType === Vilkår.NYTT_BARN_SAMME_PARTNER;
    case VilkårGruppe.SAGT_OPP_ELLER_REDUSERT:
      return vurdering.vilkårType === Vilkår.SAGT_OPP_ELLER_REDUSERT;
    case VilkårGruppe.AKTIVITET:
      return vurdering.vilkårType === Vilkår.AKTIVITET;
    case VilkårGruppe.AKTIVITET_ARBEID:
      return vurdering.vilkårType === Vilkår.AKTIVITET_ARBEID;
    case VilkårGruppe.INNTEKT:
      return vurdering.vilkårType === Vilkår.INNTEKT;
    case VilkårGruppe.ALDER_PÅ_BARN:
      return vurdering.vilkårType === Vilkår.ALDER_PÅ_BARN;
    case VilkårGruppe.DOKUMENTASJON_TILSYNSUTGIFTER:
      return vurdering.vilkårType === Vilkår.DOKUMENTASJON_TILSYNSUTGIFTER;
    case VilkårGruppe.RETT_TIL_OVERGANGSSTØNAD:
      return vurdering.vilkårType === Vilkår.RETT_TIL_OVERGANGSSTØNAD;
    case VilkårGruppe.DOKUMENTASJON_AV_UTDANNING:
      return vurdering.vilkårType === Vilkår.DOKUMENTASJON_AV_UTDANNING;
    case VilkårGruppe.ER_UTDANNING_HENSIKTSMESSIG:
      return vurdering.vilkårType === Vilkår.ER_UTDANNING_HENSIKTSMESSIG;
    default:
      return false;
  }
}

const Dokument = (dokumentProps: DokumentProps) => {
  const dokumentData = dokumentProps.dokumentData;
  const erManuellGOmregning = dokumentData.behandling.årsak === EBehandlingÅrsak.G_OMREGNING;
  return (
    <div>
      {!erManuellGOmregning &&
        Object.keys(VilkårGruppe).map(vilkårgruppe => {
          const vurderinger = dokumentData.vilkår.vurderinger.filter(vurdering =>
            gjelderDetteVilkåret(vurdering, vilkårgruppe),
          );
          if (vurderinger.length === 0) {
            return null;
          }
          const grunnlag = dokumentData.vilkår.grunnlag;
          return vurderinger.map(vurdering => {
            return (
              <div key={vurdering.id} className={'page-break'}>
                <h2>{vilkårTypeTilTekst[vurdering.vilkårType]}</h2>
                {registergrunnlagForVilkår(grunnlag, vilkårgruppe, vurdering.barnId)}
                {vurdering.vilkårType === Vilkår.TIDLIGERE_VEDTAKSPERIODER && (
                  <TidligereHistorikk
                    tidligereVedtaksperioder={dokumentData.behandling.tidligereVedtaksperioder}
                  />
                )}
                <Vilkårsvurdering vurdering={vurdering} />
              </div>
            );
          });
        })}
      <Vedtak
        stønadstype={dokumentData.behandling.stønadstype}
        vedtak={dokumentData.vedtak}
        søknadsdatoer={dokumentData.søknadsdatoer}
        årsak={dokumentData.behandling.årsak}
      />
    </div>
  );
};

function registergrunnlagForVilkår(
  grunnlag: IVilkårGrunnlag,
  vilkårgruppe: string,
  barnId?: string,
) {
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
    case VilkårGruppe.SAGT_OPP_ELLER_REDUSERT:
      return (
        <SagtOppEllerRedusertGrunnlag
          harAvsluttetArbeidsforhold={grunnlag.harAvsluttetArbeidsforhold}
        />
      );
    default:
      return <div />;
  }
}

export default Dokument;
