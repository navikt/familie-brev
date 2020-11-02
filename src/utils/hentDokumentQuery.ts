export default (dokumentNavn: string) => `
        *[_type == "dokumentmal" && id == "${dokumentNavn}"][0]
        {..., innhold[]
          {
            _type == "block"=> {..., markDefs[]{
              ..., 
              felt->, 
              skalMedFelt->, 
              submal->, 
              valgfelt->{..., valg[]{..., dokumentmal->}}}
            },
            _type == "dokumentliste" => {...}->{...,"_type": "dokumentliste"},
          }
        }
        `;
