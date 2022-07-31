import hentDokumentHtml from '../../server/hentDokumentHtml';

import { Maalform } from '../../typer/sanitygrensesnitt';
import { Datasett } from '../../server/sanity/sanityClient';
import hentAvansertDokumentHtml from '../../server/hentAvansertDokumentHtml';
import {
  demobrevInnvilgetDokumentData,
  opphorMedEndringDokumentData,
} from './__mocks__/dokumentData.mock';
import { forventetOutputDokumentOpphorMedEndring } from './__output__/opphørMedEndringHTML';
import { forventetOutputDemobrevInnvilget } from './__output__/demobrevInnvilgetHTML';

describe('hentDokumentHtml', () => {
  test('Html output skal være som forventet', async () => {
    expect(
      await hentDokumentHtml(
        opphorMedEndringDokumentData,
        Maalform.NB,
        'opphorMedEndring',
        Datasett.TEST,
      ),
    ).toBe(forventetOutputDokumentOpphorMedEndring);
  });
});

describe('hentAvansertDokumentHtml', () => {
  test('Html output skal være som forventet', async () => {
    expect(
      await hentAvansertDokumentHtml(
        demobrevInnvilgetDokumentData.brevFraSaksbehandler,
        Maalform.NB,
        'demobrevInnvilget',
        Datasett.TEST,
        demobrevInnvilgetDokumentData.saksbehandlersignatur,
        demobrevInnvilgetDokumentData.besluttersignatur,
      ),
    ).toBe(forventetOutputDemobrevInnvilget);
  });
});
