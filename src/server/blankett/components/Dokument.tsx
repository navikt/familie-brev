import React from 'react';
import Vilkårsvurdering from './Vilkårsvurdering';
import { Vedtak } from './Vedtak';
import type { IDokumentData, IVurdering } from '../../../typer/dokumentApiBlankett';
import {
  VilkårGruppe,
  Vilkår,
  EBehandlingÅrsak,
  vilkårTypeTilTekst,
} from '../../../typer/dokumentApiBlankett';
import { RegistergrunnlagForVilkår } from './RegistergrunnlagForVilkår';

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
  const tidligereVedtaksperioder = dokumentData.behandling.tidligereVedtaksperioder;
  const grunnlag = dokumentData.vilkår.grunnlag;
  const erManuellGOmregning = dokumentData.behandling.årsak === EBehandlingÅrsak.G_OMREGNING;
  const stønadstype = dokumentData.behandling.stønadstype;

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

          return vurderinger.map(vurdering => {
            return (
              <div key={vurdering.id} className={'blankett-page-break'}>
                <h2>{vilkårTypeTilTekst[vurdering.vilkårType]}</h2>
                <RegistergrunnlagForVilkår
                  grunnlag={grunnlag}
                  vilkårgruppe={vilkårgruppe}
                  barnId={vurdering.barnId}
                  tidligereVedtaksperioder={tidligereVedtaksperioder}
                  stønadstype={stønadstype}
                />
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
        harKontantstøttePerioder={dokumentData.behandling.harKontantstøttePerioder}
      />
    </div>
  );
};

export default Dokument;
