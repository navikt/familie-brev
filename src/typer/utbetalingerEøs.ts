export interface UtbetalingerPerMndEøs {
  [mndÅr: string]: UtbetalingMndEøs;
}

export interface UtbetalingMndEøs {
  utbetalinger: UtbetalingEøs[];
  oppsummering: UtbetalingMndEøsOppsummering;
}

export interface UtbetalingMndEøsOppsummering {
  summertSatsINorge: number;
  summertUtbetaltFraAnnetLand: number;
  summertUtbetaltFraNorge: number;
}

export interface UtbetalingEøs {
  barnetrygd: string;
  satsINorge: number;
  utbetaltFraAnnetLand: UtbetaltFraAnnetLand | null;
  utbetaltFraNorge: number;
}

export interface UtbetaltFraAnnetLand {
  beløp: number;
  valutakode: string;
  beløpINok: number;
}

export enum YtelseType {
  ORDINÆR_BARNETRYGD = 'ORDINÆR_BARNETRYGD',
  UTVIDET_BARNETRYGD = 'UTVIDET_BARNETRYGD',
  SMÅBARNSTILLEGG = 'SMÅBARNSTILLEGG',
}
