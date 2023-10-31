import React from 'react';

interface Props {
  harAvsluttetArbeidsforhold: boolean;
}

const SagtOppEllerRedusertGrunnlag: React.FC<Props> = ({ harAvsluttetArbeidsforhold }) => {
  return (
    <>
      <h3>Registerdata</h3>
      <div>
        Har avsluttet arbeidsforhold siste 6 mnd: {booleanTilTekst(harAvsluttetArbeidsforhold)}
      </div>
    </>
  );
};

export default SagtOppEllerRedusertGrunnlag;

const booleanTilTekst = (b: boolean): string => {
  if (b) return 'Ja';
  else return 'Nei';
};
