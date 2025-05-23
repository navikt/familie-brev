import React from 'react';

import { formaterIsoDato, formaterIsoDatoTid } from '../../utils/util';
import {
  behandlingResultatTilTekst,
  EFormVilkår,
  FormkravFristUnntak,
  formkravFristUnntakTilTekst,
  formVilkårTilTekst,
  hjemmelTilVisningstekst,
  IFormkravVilkår,
  IKlageBehandling,
  IPåklagetVedtak,
  IVurdering,
  klagebehandlingsårakTilTekst,
  vedtakTilTekst,
  årsakTilTekst,
} from '../../../typer/klageDokumentApi';

const påklagetVedtak = (påklagetVedtak?: IPåklagetVedtak) => {
  if (!påklagetVedtak) {
    return 'Har ikke klaget på et vedtak';
  } else {
    return `${påklagetVedtak.behandlingstype} - ${påklagetVedtak.resultat} - ${formaterIsoDatoTid(
      påklagetVedtak.vedtakstidspunkt,
    )}`;
  }
};

const alleFormkravOppfylt = (formkrav: IFormkravVilkår) =>
  formkrav.klagePart == EFormVilkår.OPPFYLT &&
  formkrav.klageKonkret == EFormVilkår.OPPFYLT &&
  formkrav.klagefristOverholdt == EFormVilkår.OPPFYLT &&
  formkrav.klageSignert == EFormVilkår.OPPFYLT;

const alleFormkravUtenomKlagefristOppfylt = (formkrav: IFormkravVilkår): boolean =>
  formkrav.klagePart == EFormVilkår.OPPFYLT &&
  formkrav.klageKonkret == EFormVilkår.OPPFYLT &&
  formkrav.klageSignert == EFormVilkår.OPPFYLT;

const klagefristUnntakOppfylt = (
  klagefristOverholdtUnntak: FormkravFristUnntak | undefined,
): boolean =>
  klagefristOverholdtUnntak != undefined &&
  [FormkravFristUnntak.UNNTAK_SÆRLIG_GRUNN, FormkravFristUnntak.UNNTAK_KAN_IKKE_LASTES].includes(
    klagefristOverholdtUnntak,
  );

export const KlageBehandling: React.FC<{ behandling: IKlageBehandling }> = ({ behandling }) => {
  return (
    <div className={'blankett-page-break'}>
      <h2>Behandling</h2>
      <div>
        <strong>Saksnummer:</strong> {behandling.eksternFagsakId}
      </div>
      <div>
        <strong>Klage mottatt:</strong> {formaterIsoDato(behandling.klageMottatt)}
      </div>
      <div>
        <strong>Resultat:</strong> {behandlingResultatTilTekst[behandling.resultat]}
      </div>
      <div>
        <strong>Vedtak som er påklaget:</strong> {påklagetVedtak(behandling.påklagetVedtak)}
      </div>
      <div>
        <strong>Behandlingsårsak:</strong> {klagebehandlingsårakTilTekst[behandling.årsak]}
      </div>
    </div>
  );
};

export const KlageFormkrav: React.FC<{ formkrav: IFormkravVilkår }> = ({ formkrav }) => {
  return (
    <div className={'blankett-page-break'}>
      <>
        <h2>Formkrav</h2>
        <h4 className={'blankett'}>Er klager part i saken?</h4>
        <span>{formVilkårTilTekst[formkrav.klagePart]}</span>
        <h4 className={'blankett'}>Klages det på konkrete elementer i vedtaket?</h4>
        <span>{formVilkårTilTekst[formkrav.klageKonkret]}</span>
        <h4 className={'blankett'}>Er klagefristen overholdt?</h4>
        <span>{formVilkårTilTekst[formkrav.klagefristOverholdt]}</span>
        {formkrav.klagefristOverholdt === EFormVilkår.IKKE_OPPFYLT &&
          formkrav.klagefristOverholdtUnntak && (
            <>
              <h5>Er unntak for klagefristen oppfylt?</h5>
              <span>{formkravFristUnntakTilTekst[formkrav.klagefristOverholdtUnntak]}</span>
            </>
          )}
        <h4 className={'blankett'}>Er klagen signert?</h4>
        <span>{formVilkårTilTekst[formkrav.klageSignert]}</span>
        {formkrav.saksbehandlerBegrunnelse && (
          <>
            <h4 className={'blankett'}>Begrunnelse</h4>
            <span style={{ whiteSpace: 'pre-wrap' }}>{formkrav.saksbehandlerBegrunnelse}</span>
          </>
        )}
        {!alleFormkravOppfylt(formkrav) &&
          !klagefristUnntakOppfylt(formkrav.klagefristOverholdtUnntak) &&
          formkrav.brevtekst && (
            <>
              <h4 className={'blankett'}>Fritekst til brev</h4>
              <span style={{ whiteSpace: 'pre-wrap' }}>{formkrav.brevtekst}</span>
            </>
          )}
      </>
    </div>
  );
};

export const Klagevurdering: React.FC<{
  vurdering?: IVurdering;
  formkrav?: IFormkravVilkår;
}> = ({ vurdering, formkrav }) => {
  if (!vurdering || !formkrav) {
    return null;
  }

  const skalInkludereKlagefristUnntakBegrunnelse =
    alleFormkravUtenomKlagefristOppfylt(formkrav) &&
    klagefristUnntakOppfylt(formkrav.klagefristOverholdtUnntak);

  return (
    <div className={'blankett-page-break'}>
      <h2>Vurdering</h2>
      <h4 className={'blankett'}>Vedtak</h4>
      <span>{vedtakTilTekst[vurdering.vedtak]}</span>
      {vurdering.hjemmel && (
        <>
          <h4 className={'blankett'}>Hjemmel</h4>
          <span>{hjemmelTilVisningstekst[vurdering.hjemmel]}</span>
        </>
      )}
      {vurdering.årsak && (
        <>
          <h4 className={'blankett'}>Årsak</h4>
          <span>{årsakTilTekst[vurdering.årsak]}</span>
        </>
      )}
      {vurdering.begrunnelseOmgjøring && (
        <>
          <h4 className={'blankett'}>Begrunnelse for omgjøring</h4>
          <span style={{ whiteSpace: 'pre-wrap' }}>{vurdering.begrunnelseOmgjøring}</span>
        </>
      )}
      {vurdering.innstillingKlageinstans && (
        <>
          <h4 className={'blankett'}>Innstilling til Nav Klageinstans</h4>
          <span style={{ whiteSpace: 'pre-wrap' }}>{vurdering.innstillingKlageinstans}</span>
        </>
      )}
      {vurdering.dokumentasjonOgUtredning &&
        vurdering.spørsmåletISaken &&
        vurdering.aktuelleRettskilder &&
        vurdering.klagersAnførsler &&
        vurdering.vurderingAvKlagen && (
          <>
            <h4 className={'blankett'}>Innstilling til Nav Klageinstans</h4>
            {skalInkludereKlagefristUnntakBegrunnelse && (
              <p style={{ whiteSpace: 'pre-wrap' }}>{formkrav.brevtekst}</p>
            )}
            <p style={{ whiteSpace: 'pre-wrap' }}>{vurdering.dokumentasjonOgUtredning}</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{vurdering.spørsmåletISaken}</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{vurdering.aktuelleRettskilder}</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{vurdering.klagersAnførsler}</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{vurdering.vurderingAvKlagen}</p>
          </>
        )}
      {vurdering.interntNotat && (
        <>
          <h4 className={'blankett'}>Internt notat</h4>
          <span style={{ whiteSpace: 'pre-wrap' }}>{vurdering.interntNotat}</span>
        </>
      )}
    </div>
  );
};
