export const hentAvansertDokumentQuery = (
  dokumentType: string,
  apiNavn: string,
  maalform: string,
) => `
*[_type == "${dokumentType}" && apiNavn == "${apiNavn}"][0]
  {..., ${maalform}[]
    { ...,
  _type == "block"=> {..., markDefs[]{
    ...,
    flettefeltReferanse->,
    delmalReferanse->,
    valgReferanse->{..., valg[]{..., delmal->}}
    }
  },
  _type == "valgBlock" => {..., valgReferanse->{..., valg[]{..., delmal->}}},
  _type == "flettefelt" => {..., flettefeltReferanse->},
  _type == "htmlfelt" => {..., htmlfeltReferanse->},
  _type == "delmalBlock" => {..., delmalReferanse->}
  },
}
`;

export const hentDokumentQuery = (
  dokumentType: string,
  dokumentApiNavn: string,
  maalform: string,
) => `
*[_type == "${dokumentType}" && apiNavn == "${dokumentApiNavn}"][0]
  {..., ${maalform}[]
    { ...,
      _type == "block" => {..., markDefs[]{..., flettefeltReferanse->}},
      _type == "flettefelt" => {..., flettefeltReferanse->},
      _type == "delmal" => {..., delmalReferanse->${hentDelmalQuery(maalform)}},
    }
  }
 `;

export const hentDelmalQuery = (maalform: string) => `
  {..., ${maalform}[]
    { ..., 
      _type == "block" => {..., markDefs[]{..., flettefeltReferanse->}},
      _type == "flettefelt" => {..., flettefeltReferanse->}
    }
  }
 `;
