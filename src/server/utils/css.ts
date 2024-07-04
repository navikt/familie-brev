export default `
  .body {
    font-family: Source Sans Pro, sans-serif;
    font-size: 12pt;
    line-height: 1.4em;
    margin: 0;
    box-sizing: border-box;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-container > *:not(:last-child) {
    margin-right: 8px;
  }
  
  .ikon-og-dato-wrapper {
    text-align: right;
  }

  .ikon-og-dato {
    display: inline-block;
    text-align: center;
  }

  .nav-ikon {
    width: 100px;
    height: 65px;
    display: inline-block;
  }

  .inline {
    display: inline-block;
  }

  .header {
    margin-bottom: 20px;
  }

  .tittel-og-personinfo {
    margin-top: 80px;
  }
  
  .lenke {
    white-space: nowrap;
  }

  ul {
    margin: 0;
  }
  
  .block {
    white-space: pre-wrap;
  }
  
  @page {
    @bottom-right {
      font-family: Source Sans Pro, sans-serif;
      content: 'Side ' counter(page) ' av ' counter(pages);  
    }
  }
  
  .høyrestill {
    float: right;
    white-space: normal;
  }
  
  .blankett-delvilkår {
    margin-bottom: 5px;
  }
  
  .blankett-vilkårsresultat {
    font-size: 1.2rem;
    margin-bottom: 16px;
    margin-top: 10px;
  }
  
  .blankett-page-break {
    page-break-inside: avoid;
  }
  
  .blankett-vilkårsresultat-ikon {
    display: inline-block;
    width: 24px;
    height: 24px;
    position: relative;
    top: 5px;
    margin:0;
    padding:0;
  }
  
  h3, h4 {
    &.blankett {
      margin-bottom: 3px;
    }
  }
  
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  
  td, th {
    padding: 0.5rem
  }

  .tabellUtenBorder {
    border: none;
  }

  .tabellUtenBorder th, .tabellUtenBorder td {
    border: none;
  }
  
  .tabellUtenBorder th {
    font-weight: normal;
    text-align: left;
    padding-bottom: 0.5rem;
  }
`;
