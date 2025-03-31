import { parse, getYear, getMonth, format, parseISO } from 'date-fns';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

export const datoFormat: DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

export const datoFormatLang: DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

const datoTidFormat: DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

export const månedÅrFormat: DateTimeFormatOptions = {
  month: '2-digit',
  year: 'numeric',
};

export const dagensDatoFormatert = (): string => new Date().toLocaleDateString('no-NO', datoFormat);

export const dagensDatoFormatertLang = (): string =>
  new Date().toLocaleDateString('no-NO', datoFormatLang);

export const dagensDatoTidFormatert = (): string =>
  new Date().toLocaleString('no-NO', datoTidFormat);

export const formaterNullableIsoDato = (dato?: string): string | undefined =>
  dato && formaterIsoDato(dato);

export const parseOgFormaterÅrMåned = (årMåned: string): string | undefined =>
  årMåned ? parse(årMåned, 'yyyy-MM', new Date()).toLocaleDateString('no-NO', månedÅrFormat) : '';

export const formaterNullableMånedÅr = (dato?: string): string | undefined =>
  dato && parseISO(dato).toLocaleDateString('no-NO', månedÅrFormat);

export const formaterIsoDato = (dato: string): string =>
  parseISO(dato).toLocaleDateString('no-NO', datoFormat);

export const formaterIsoDatoTid = (dato: string): string =>
  format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm");

export const tilSkoleår = (årMåned: string): number => {
  const dato = månedÅrTilDate(årMåned);
  const år = getYear(dato);
  return getMonth(dato) > 6 ? år : år - 1;
};

export const månedÅrTilDate = (årMåned: string): Date => parse(årMåned, 'yyyy-MM', new Date());

export const formaterBeløp = (verdi: number): string =>
  Number(verdi).toLocaleString('no-NO', { currency: 'NOK' }) + ' kr';

export const formaterBeløpMedPostfix = (verdi: number, postfix: string): string =>
  `${verdi.toLocaleString('no-NO')} ${postfix}`;

export const mapBooleanTilJaNei = (bool?: boolean, storeBokstaver: boolean = false): string => {
  const ja = storeBokstaver ? 'JA' : 'Ja';
  const nei = storeBokstaver ? 'NEI' : 'Nei';
  return bool ? ja : nei;
};

export const mapBooleanTilString = (bool?: boolean) =>
  bool === undefined || bool === null ? 'Ukjent' : mapBooleanTilJaNei(bool);
