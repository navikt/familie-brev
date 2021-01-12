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

export const hentEnkeltDokumentQuery = (
  dokumentType: string,
  dokumentId: string,
  maalform: string,
) => `
*[_type == "${dokumentType}" && id == "${dokumentId}"][0]
        {..., ${maalform}
          {
            _type == "block"=> {..., markDefs[]{
              ..., 
              felt->, 
              skalMedFelt->, 
              submal->{..., markDefs[]{
              ..., 
              felt->}}
            }},
            _type == "enkelDelmalBlock" => {..., submal->},
          }
        }
        `;
