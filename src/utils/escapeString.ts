export const escape = (tekst: string) =>
  tekst.replace(/[^0-9A-Za-z ]/g, c => '&#' + c.charCodeAt(0) + ';');
