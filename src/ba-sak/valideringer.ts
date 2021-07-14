import { IBegrunnelseData } from './typer';
import { Feil } from '../server/utils/Feil';
import { Maalform } from '../typer/sanitygrensesnitt';

export const validerBegrunnelseData = (data: IBegrunnelseData) => {
  if (data === null) {
    throw new Feil('Det ble ikke sendt med data til begrunnelsen.', 400);
  }
  if (data.gjelderSøker === undefined) {
    throw new Feil('gjelderSøker ble ikke sendt med dataene til begrunnelsen', 400);
  }
  if (data.antallBarn === undefined) {
    throw new Feil('antallBarn ble ikke sendt med dataene til begrunnelsen', 400);
  }
  if (!data.barnasFødselsdatoer) {
    throw new Feil('barnasFødselsdatoer ble ikke sendt med dataene til begrunnelsen', 400);
  }

  if ((typeof data.barnasFødselsdatoer as any) !== 'string') {
    throw new Feil(
      `barnasFødselsdatoer skal være en streng, men fødselsdatoene ble sent som "${typeof data.barnasFødselsdatoer}"`,
      400,
    );
  }

  if (!Object.values(Maalform).includes(data.målform)) {
    throw new Feil(`Målformen "${data.målform}" finnes ikke.`, 404);
  }
};

export const validerBegrunnelse = (begrunnelseFraSanity: any, apiNavn: string) => {
  if (begrunnelseFraSanity === null) {
    throw new Feil(`Fant ikke begrunnelse med apiNavn ${apiNavn}`, 404);
  }
};
