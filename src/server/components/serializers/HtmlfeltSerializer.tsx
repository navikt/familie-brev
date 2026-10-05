import type { IHtmlfelter } from '../../../typer/dokumentApiBrev.js';
import { Feil } from '../../utils/Feil.js';

interface IHtmlfeltSerializerProps {
    sanityProps: any;
    htmlfelter: IHtmlfelter | undefined;
    dokumentApiNavn: string;
}

export const HtmlfeltSerializer = (props: IHtmlfeltSerializerProps) => {
    const { sanityProps, htmlfelter, dokumentApiNavn } = props;
    const htmlfeltNavn = hentFeltnavn(sanityProps);

    if (!htmlfelter?.[htmlfeltNavn]) {
        throw new Feil(
            `Htmlfelt "${htmlfeltNavn}" er påkrevd for "${dokumentApiNavn}", ` +
                `men det ble ikke sendt med noen htmlfelter.`,
            400
        );
    }

    const htmlfelt = htmlfelter[htmlfeltNavn];

    // biome-ignore lint/security/noDangerouslySetInnerHtml: htmlfelter sendes som ferdig HTML fra konsumenten og skal flettes inn uendret
    return <div dangerouslySetInnerHTML={{ __html: htmlfelt }} />;
};

const hentFeltnavn = (sanityProps: any) => {
    const { htmlfeltReferanse, felt } = sanityProps.value;

    // Dersom flettefeltet er en referanse ligger det i flettefeltReferanse og må hentes derifra
    return felt ? felt : htmlfeltReferanse.felt;
};
