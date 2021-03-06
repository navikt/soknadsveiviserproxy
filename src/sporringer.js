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
                       ${pdfAlleSprak()},
                       ...
                     },
                     tema->,
                     innsendingsmate{
                       spesifisertadresse->,
                       ...
                     },
                     muligeEnheterForInnsending[]->,
                     "vedleggtilsoknad": vedleggskjema[]{
                      vedlegg->{
                        skjematilvedlegg->{
                              ${pdfAlleSprak()},
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
                },
                skjemalenker[] -> {
                    hovedskjema ->{
                       ${pdfAlleSprak()},
                       ...
                     },
                    ...
                }
            }
        }`;

const soknadsobjektKlageAnke = () =>
  `*[_type == "soknadsobjekt" && navn.nb == "Klage/anke" && !(_id in path("drafts.**"))][0]
      {
        hovedskjema->{
          ${pdfAlleSprak()},
          ...
        },
        "vedleggtilsoknad": vedleggskjema[]{
          vedlegg->{
            skjematilvedlegg->{
                  ${pdfAlleSprak()},
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
      ${pdfAlleSprak()},
      ...
    },
    tema->, gosysid, "vedleggtilsoknad": vedleggskjema[]{
      vedlegg->{
        _id,
        gosysid,
        skjematilvedlegg->{
          _id,
          navn,
          skjemanummer,
          ${pdfAlleSprak()},
          ...
        },
        vedleggsid,
        navn}
      }
  }`;

const alleSkjemaer = (skjematype) =>
  `*[_type == ${JSON.stringify(skjematype)} && !(_id in path("drafts.**"))]
        {"emneord": emneord[]->{emneord}, _id, _type, skjemanummer, navn,
        ${pdfAlleSprak()}}`;

const alleVedlegg = () =>
  `*[_type == "vedlegg" && !(_id in path("drafts.**"))]
        {_id, skjematilvedlegg->, navn, vedleggsid}`;

const samlet = () =>
  `*[_type == "kategori" && !(_id in path("drafts.**"))]
        {"tittel": tittel, urlparam, _id, domene, underkategorier[]
            {_id, "navn": navn, inngangtilsoknadsdialog, urlparam, soknadslenker[]->{lenke, navn, _id, beskrivelse},
                soknadsobjekter[]->
                {_id, digitalinnsending, "navn": navn, tema, urlparam, beskrivelse,
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

const fil = (skjemanummer, locale) =>
  `*[_type in ["skjema", "interneskjema", "sedskjema"] && !(_id in path("drafts.**")) && skjemanummer == ${JSON.stringify(
    skjemanummer
  )}]{"url": pdf.[${JSON.stringify(locale)}].asset->url}[0]`;

const pdfAlleSprak = () =>
  `pdf{
  nb{asset->},
  en{asset->},
  nn{asset->},
  se{asset->},
  fr{asset->},
  de{asset->},
  pl{asset->},
  es{asset->}
}`;

module.exports = {
  alleKategorier,
  alleSoknadsobjekter,
  alleSkjemaer,
  soknadsobjektKlageAnke,
  soknader,
  samlet,
  alleKategorierOgUnderkategorier,
  alleVedlegg,
  fil,
};
