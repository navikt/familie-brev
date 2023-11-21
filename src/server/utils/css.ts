export default `
  .body {
    font-family: Source Sans Pro, sans-serif;
    font-size: 12pt;
    line-height: 1.4em;
    margin: 0;
    box-sizing: border-box;
  }

  .ikon-og-dato {
    position: absolute;
    right: 0px;
    top: 0px;
    margin:0;
    padding:0;
  }

  .nav-ikon {
    width: 100px;
    height: 65px;
    position: relative;
    right: 0px;
    margin: 0;
    padding: 0;
  }

  .inline {
    display: inline-block;
  }

  .header {
    margin-bottom: 20px;
  }

  .tittel-og-personinfo {
    margin-top: 200px;
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
`;
