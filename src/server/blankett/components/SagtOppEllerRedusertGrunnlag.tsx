import React from 'react';

interface Props {
  harAvsluttetArbeidsforhold: boolean;
}

export const SagtOppEllerRedusertGrunnlag: React.FC<Props> = ({ harAvsluttetArbeidsforhold }) => {
  return (
    <>
      <h3 className={'blankett'}>Registerdata</h3>
      <div>
        Har avsluttet arbeidsforhold siste 6 mnd: {booleanTilTekst(harAvsluttetArbeidsforhold)}
      </div>
    </>
  );
};

const booleanTilTekst = (b: boolean): string => {
  if (b) return 'Ja';
  else return 'Nei';
};
