export default (dokumentType: string, dokumentNavn: string, maalform: string) => `
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
            _type == "dokumentliste" => {...}->{...,"_type": "dokumentliste"},
            _type == "delmalBlock" => {..., submal->},
          }
        }
        `;
