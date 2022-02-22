import { IHtmlfelter } from '../../../typer/dokumentApi';
import React from 'react';
import { Feil } from '../../utils/Feil';

interface IHtmlfeltSerializerProps {
  sanityProps: any;
  htmlfelter: IHtmlfelter | undefined;
  dokumentApiNavn: string;
}

const HtmlfeltSerializer = (props: IHtmlfeltSerializerProps) => {
  const { sanityProps, htmlfelter, dokumentApiNavn } = props;
  const htmlfeltNavn = hentFeltnavn(sanityProps);

  if (!htmlfelter || !htmlfelter[htmlfeltNavn]) {
    throw new Feil(
      `Htmlfelt "${htmlfeltNavn}" er påkrevd for "${dokumentApiNavn}", ` +
        `men det ble ikke sendt med noen htmlfelter.`,
      400,
    );
  }

  const htmlfelt = htmlfelter[htmlfeltNavn];

  return <div dangerouslySetInnerHTML={{ __html: htmlfelt }} />;
};

const hentFeltnavn = (sanityProps: any) => {
  // Om flettefeltet hentes fra en annotering finnes den i props.mark.
  // Om den hentes fra en block finnes den i props.node.
  const { htmlfeltReferanse, felt } = sanityProps.mark || sanityProps.node;

  // Dersom flettefeltet er en referanse ligger det i flettefeltReferanse og må hentes derifra
  return felt ? felt : htmlfeltReferanse.felt;
};

export default HtmlfeltSerializer;
