export const hentDokumentQuery = (dokumentType: string, dokumentNavn: string, maalform: string) => `
        *[_type == "${dokumentType}" && id == "${dokumentNavn}"][0]
        {..., ${maalform}[]
          {
            _type == "block"=> {..., markDefs[]{
              ..., 
              felt->, 
              skalMedFelt->, 
              submal->, 
              valgfelt->{..., valg[]{..., delmal->}}}
            },
            _type == "enkelDelmalBlock" => {..., submal->},
            _type == "delmalBlock" => {..., submal->},
            _type == "valgfeltBlock" => {..., valgfelt->{..., valg[]{..., delmal->}}},
          }
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
      _type == "block"=> {..., markDefs[]{
        ...,
        flettefeltReferanse->
        }
      },
      _type == "flettefelt" => {..., flettefeltReferanse->},
      _type == "delmal" => {..., 
        delmalReferanse->{
          ..., ${maalform}[]{
            ..., 
            _type == "block"=> {..., markDefs[]{
                ...,
                flettefeltReferanse->
              },
            _type == "flettefelt" => {..., flettefeltReferanse->}
            },
          }
        }
      },
    }
  }
 `;
