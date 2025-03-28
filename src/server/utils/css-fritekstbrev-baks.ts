export default `
    @page {
        size: A4;
        margin-top: 64px;
        margin-left: 64px;
        margin-right: 64px;
        margin-bottom: 74px;

        @bottom-right {
            font-family: Source Sans Pro, sans-serif;
            content: 'side ' counter(page) ' av ' counter(pages);
            padding-bottom: 26px;
        }
    }

    @media print {
        h1, h2, h3, h4 {
            page-break-after: avoid;
        }
    }

    html {
        font-family: Source Sans Pro, sans-serif;
        font-size: 16pt;
        line-height: 16pt;
    }

    body {
        font-size: 0.688rem;
        letter-spacing: 0;
    }

    h1 {
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: bold;
        letter-spacing: 0.019rem;
        margin-bottom: 1.625rem;
    }

    h2 {
        font-size: 0.813rem;
        font-weight: bold;
        letter-spacing: 0.016rem;
        margin-bottom: 0.375rem;
    }

    h3 {
        font-size: 0.75rem;
        font-weight: bold;
        letter-spacing: 0.006rem;
        margin-bottom: 0.375rem;
    }

    h4 {
        font-size: 0.688rem;
        font-weight: bold;
        letter-spacing: 0.013rem;
        margin-bottom: 0.375rem;
    }

    p + h2,
    p + h3 {
        margin-top: 1.625rem;
    }

    .nav-ikon {
        width: 54px;
        height: 16px;
        display: inline-block;
        margin-bottom: 3rem;
    }

    .person-og-saksinfo {
        width: 100%;
        margin-bottom: 3rem;
    }

    .person-og-saksinfo th {
        font-weight: normal;
        width: 6.188rem;
    }

    .person-og-saksinfo .dato {
        text-align: right;
    }

    .signatur {
        margin-top: 2rem;
        page-break-inside: avoid;
        margin-bottom: 2.5rem;
    }
`;
