export const escape = (tekst: string) =>
  tekst.replace(/[^0-9A-ZÆØÅa-zæøå ]/g, c => '&#' + c.charCodeAt(0) + ';');
