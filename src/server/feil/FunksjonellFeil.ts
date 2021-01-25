export default class FunksjonellFeil extends Error {
  public code: number;
  constructor(melding: string, code: number) {
    super(melding);
    this.code = code;
  }
}
