import { hentBarnetBarnaValg } from '../formateringsvalg';
import { mockBegrunnelsedata } from './__mocks__/begrunnelsedata.mock';

describe('hentBarnetBarnaValg', () => {
  test('skal kaste en feil ved 0 barn', () => {
    const begrunnelsedata = mockBegrunnelsedata({
      antallBarn: 0,
    });
    expect(() => hentBarnetBarnaValg(begrunnelsedata)).toThrow(Error);
  });
});
