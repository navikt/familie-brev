import { parse, getYear, getMonth, format, parseISO } from 'date-fns';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
export const datoFormat: DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

export const månedÅrFormat: DateTimeFormatOptions = {
  month: '2-digit',
  year: 'numeric',
};

export const formaterNullableIsoDato = (dato?: string): string | undefined =>
  dato && formaterIsoDato(dato);

export const parseOgFormaterÅrMåned = (årMåned: string): string | undefined => {
  return årMåned
    ? parse(årMåned, 'yyyy-MM', new Date()).toLocaleDateString('no-NO', månedÅrFormat)
    : '';
};

export const formaterNullableMånedÅr = (dato?: string): string | undefined =>
  dato && parseISO(dato).toLocaleDateString('no-NO', månedÅrFormat);

export const formaterIsoDato = (dato: string): string => {
  return parseISO(dato).toLocaleDateString('no-NO', datoFormat);
};

export const formaterIsoDatoTid = (dato: string): string => {
  return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm");
};

export const tilSkoleår = (årMåned: string): number => {
  const dato = månedÅrTilDate(årMåned);
  const år = getYear(dato);
  return getMonth(dato) > 6 ? år : år - 1;
};

export const månedÅrTilDate = (årMåned: string): Date => {
  return parse(årMåned, 'yyyy-MM', new Date());
};

export const formaterBeløp = (verdi: number): string =>
  Number(verdi).toLocaleString('no-NO', { currency: 'NOK' }) + ' kr';

const mapTrueFalse = (bool?: boolean): string => (bool ? 'Ja' : 'Nei');

export const mapBooleanTilString = (bool?: boolean) =>
  bool === undefined || bool === null ? 'Ukjent' : mapTrueFalse(bool);
