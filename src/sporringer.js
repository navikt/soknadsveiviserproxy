const alleKategorier = () =>
  `*[_type == "kategori" && !(_id in path("drafts.**"))]
    {
      "domenefarge":domenefarge.hex,
      "kantfarge":kantfarge.hex,
      ...
    }`;

const alleKategorierOgUnderkategorier = () =>
  `*[_type == "kategori" && !(_id in path("drafts.**"))]
    {
      tittel,
      underkategorier[]{
        navn, 
        soknadsobjekter[]->{
          _id,
          navn,
          hovedskjema->{skjemanummer},
          tema->{temakode},
          digitalinnsending
        }
      }
    }`;

const soknader = (kategoriUrlparam, underkategoriUrlparam) =>
  `*[_type == "kategori"
    && urlparam == ${JSON.stringify(kategoriUrlparam)}
        && !(_id in path("drafts.**"))]{
            underkategorier[
            urlparam == ${JSON.stringify(underkategoriUrlparam)} ][0]{
                soknadsobjekter[] -> {
                     hovedskjema ->{
                       pdf{
                         nb{asset->},
                         en{asset->},
                         nn{asset->},
                         se{asset->},
                         fr{asset->},
                         de{asset->},
                         pl{asset->},
                         es{asset->}
                       },
                       ...
                     },
                     tema->,
                     innsendingsmate{
                       spesifisertadresse->,
                       ...
                     },
                     "vedleggtilsoknad": vedleggskjema[]{
                      vedlegg->{
                        skjematilvedlegg->{
                              pdf{
                                nb{asset->},
                                en{asset->},
                                nn{asset->},
                                se{asset->},
                                fr{asset->},
                                de{asset->},
                                pl{asset->},
                                es{asset->}
                              },
                              ...
                            },
                            ...
                          },
                          ...
                    },
                    ...
                },
                soknadslenker[] -> {
                    ...
                }
            }
        }`;

const soknadsobjektKlageAnke = () =>
  `*[_type == "soknadsobjekt" && navn.nb == "Klage/anke" && !(_id in path("drafts.**"))][0]
      {
        hovedskjema->{
          pdf{
            nb{asset->},
            en{asset->},
            nn{asset->},
            se{asset->},
            fr{asset->},
            de{asset->},
            pl{asset->},
            es{asset->}
          },
          ...
        },
        "vedleggtilsoknad": vedleggskjema[]{
          vedlegg->{
            skjematilvedlegg->{
                  pdf{
                    nb{asset->},
                    en{asset->},
                    nn{asset->},
                    se{asset->},
                    fr{asset->},
                    de{asset->},
                    pl{asset->},
                    es{asset->}
                  },
                  ...
                },
            ...
          },
          ...
        },
        ...
      }`;

const alleSoknadsobjekter = () =>
  `*[_type == "soknadsobjekt" && !(_id in path("drafts.**"))]{
  _id,
  navn,
  hovedskjema->{
      _id,
      navn,
      skjemanummer,
      pdf{
        nb{asset->},
        en{asset->},
        nn{asset->},
        se{asset->},
        fr{asset->},
        de{asset->},
        pl{asset->},
        es{asset->}
      },
      ...
    },
    tema->, gosysid, "vedleggtilsoknad": vedleggskjema[]{
      vedlegg->{
        _id,
        gosysid,
        skjematilvedlegg->,
        vedleggsid,
        navn}
      }
  }`;

const alleSkjemaer = () =>
  `*[_type == "skjema" && !(_id in path("drafts.**"))]
        {"emneord": emneord[]->{emneord}, _id, _type, skjemanummer, "navn": navn.nb,
        pdf{
        nb{asset->},
        en{asset->},
        nn{asset->},
        se{asset->},
        fr{asset->},
        de{asset->},
        pl{asset->},
        es{asset->}
      }}`;

const alleInterneSkjemaer = () =>
  `*[_type == "interneskjema" && !(_id in path("drafts.**"))]
        {"emneord": emneord[]->{emneord}, _id, _type, skjemanummer, "navn": navn.nb,
        pdf{
        nb{asset->},
        en{asset->},
        nn{asset->},
        se{asset->},
        fr{asset->},
        de{asset->},
        pl{asset->},
        es{asset->}
      }}`;

const alleEESSISkjemaer = () =>
  `*[_type == "eessiskjema" && !(_id in path("drafts.**"))]
        {"emneord": emneord[]->{emneord}, _id, _type, skjemanummer, "navn": navn.nb,
        pdf{
        nb{asset->},
        en{asset->},
        nn{asset->},
        se{asset->},
        fr{asset->},
        de{asset->},
        pl{asset->},
        es{asset->}
      }}`;

const alleVedlegg = () =>
  `*[_type == "vedlegg" && !(_id in path("drafts.**"))]
        {_id, skjematilvedlegg->, navn, vedleggsid}`;

const samlet = () =>
  `*[_type == "kategori" && !(_id in path("drafts.**"))]
        {"tittel": tittel, urlparam, _id,  underkategorier[]
            {_id, "navn": navn, inngangtilsoknadsdialog, urlparam,
                soknadsobjekter[]->
                {_id, digitalinnsending, "navn": navn, tema, urlparam,
                    innsendingmate{spesifisertadresse->, skanning, visenheter}, hovedskjema->, "vedleggtilsoknad":
                    vedleggskjema[]
                    {"beskrivelse": beskrivelse, pakrevd, vedlegg->
                        {gosysid, kanskannes, vedleggsid,
                        skjematilvedlegg->
                            {emneord, "beskrivelse": beskrivelse,
                            "gyldigfra": gyldigfra, "gyldigtil":
                            gyldigtil, "navn": navn, pdf{
                              asset->{url}
                            }, skjemanummer
                        }, vedleggsid, beskrivelse, navn}
                    }
                }
            }
        }`;

module.exports = {
  alleKategorier,
  alleSoknadsobjekter,
  alleSkjemaer,
  alleInterneSkjemaer,
  alleEESSISkjemaer,
  soknadsobjektKlageAnke,
  soknader,
  samlet,
  alleKategorierOgUnderkategorier,
  alleVedlegg
};
