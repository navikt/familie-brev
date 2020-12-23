import { RadioPanelGruppe } from 'nav-frontend-skjema';
import MenyVariabler from '../MenyVariabler';
import React from 'react';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import { IDokumentVariabler, IValg } from '../../../../server/sanity/DokumentVariabler';
import { camelCaseTilVanligTekst } from '../../../utils/camelCaseTilVanligTekst';

interface ValgFeltProps {
  valgfelt: IValg;
  navn: string;
  endreValgfeltIDokumentVariabler: (valgfeltNavn: string, valgfelt: IValg) => void;
}

function ValgFelt(props: ValgFeltProps) {
  const { navn, valgfelt, endreValgfeltIDokumentVariabler } = props;

  const endreValg = (valg: IValg) => {
    const nyttValgFelt: IValg = {
      muligeValg: valgfelt.muligeValg,
      valgNavn: valg.valgNavn,
      valgVariabler: valg.valgVariabler,
    };
    endreValgfeltIDokumentVariabler(navn, nyttValgFelt);
  };

  const endreValgFeltVariabler = (valgfeltVariabler: IDokumentVariabler) => {
    const nyeMuligeValg = valgfelt.muligeValg?.map(muligValg =>
      muligValg.valgNavn === valgfelt.valgNavn
        ? {
            muligeValg: undefined,
            valgNavn: muligValg.valgNavn,
            valgVariabler: valgfeltVariabler,
          }
        : muligValg,
    );

    const nyttValgFelt = {
      ...valgfelt,
      valgVariabler: valgfeltVariabler,
      muligeValg: nyeMuligeValg,
    };
    endreValgfeltIDokumentVariabler(navn, nyttValgFelt);
  };

  return (
    <>
      <StyledValgHeader>{camelCaseTilVanligTekst(navn)}</StyledValgHeader>
      {valgfelt.muligeValg && (
        <RadioPanelGruppe
          name={camelCaseTilVanligTekst(navn)}
          radios={valgfelt.muligeValg?.map(muligValg => ({
            checked: muligValg.valgNavn === valgfelt.valgNavn,
            onChange: _ => endreValg(muligValg),
            label: camelCaseTilVanligTekst(muligValg.valgNavn),
            name: navn,
          }))}
          onChange={_ => undefined}
        />
      )}
      {valgfelt.valgVariabler && (
        <MenyVariabler settVariabler={endreValgFeltVariabler} variabler={valgfelt.valgVariabler} />
      )}
    </>
  );
}

const StyledValgHeader = styled(Element)`
  text-transform: capitalize;
  margin-bottom: 0.5rem;
`;

export default ValgFelt;
