export default `
  .body {
      font-family: Source Sans Pro, sans-serif;
      font-size: 12pt;
      line-height: 1.4em;
      margin: 0;
      box-sizing: border-box;
  }

  .ikon-og-dato{
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

  .inline{
    display: inline-block;
  }

  .header{
    margin-bottom: 20px;
  }

  .tittel-og-personinfo{
    margin-top: 200px;
  }
  
  .lenke {
    white-space: nowrap;
  }

  ul {
    margin: 0;
  }
  
  .block{
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
  
`;
