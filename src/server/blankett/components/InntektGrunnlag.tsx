import React from 'react';
import type {
    EStønadType,
    IGrunnlagsdataSistePeriodeOvergangsstønad,
    ITidligereVedtaksperioder,
} from '../../../typer/dokumentApiBlankett.js';
import {
    aktivitetsTypeTilTekst,
    periodetypeTilTekst,
    EStønadType as StønadType,
} from '../../../typer/dokumentApiBlankett.js';
import { formaterIsoDato } from '../../utils/util.js';

export const InntektGrunnlag: React.FC<{
    tidligereVedtaksperioder: ITidligereVedtaksperioder | undefined;
    stønadstype: EStønadType;
}> = ({ tidligereVedtaksperioder, stønadstype }) => {
    const sistePeriodeMedOvergangsstønad = tidligereVedtaksperioder?.sak?.sistePeriodeMedOvergangsstønad;

    if (!sistePeriodeMedOvergangsstønad) {
        return null;
    }

    const skalViseSamordning = sistePeriodeMedOvergangsstønad.samordningsfradrag > 0;

    return (
        <>
            <h3>Registerdata</h3>
            <p>Siste periode med overgangsstønad</p>
            <table>
                <thead>
                    <tr>
                        <th>Periode</th>
                        <th>Type</th>
                        {stønadstype === StønadType.BARNETILSYN ? (
                            <>
                                <th>Inntekt</th>
                                {skalViseSamordning && <th>Samordning</th>}
                            </>
                        ) : (
                            <th>Aktivitet</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {[sistePeriodeMedOvergangsstønad].map(
                        (periode: IGrunnlagsdataSistePeriodeOvergangsstønad, index) => (
                            <tr key={index}>
                                <td>
                                    {formaterIsoDato(periode.fom)} - {formaterIsoDato(periode.tom)}
                                </td>
                                <td>{periodetypeTilTekst[periode.vedtaksperiodeType]}</td>
                                {stønadstype === StønadType.BARNETILSYN ? (
                                    <>
                                        <td>{periode.inntekt ?? 0}</td>
                                        {skalViseSamordning && <td>{periode.samordningsfradrag}</td>}
                                    </>
                                ) : (
                                    <td>{periode.aktivitet ? aktivitetsTypeTilTekst[periode.aktivitet] : ''}</td>
                                )}
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </>
    );
};
