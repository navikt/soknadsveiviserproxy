const alleKategorier = () =>
  `*[_type == "kategori" && !(_id in path("drafts.**"))]
    {
      "domenefarge":domenefarge.hex,
      "kantfarge":kantfarge.hex,
      ...
    }`;

const soknader = (kategoriUrlparam, underkategoriUrlparam) =>
  `*[_type == "kategori"
    && urlparam == ${JSON.stringify(kategoriUrlparam)}
        && !(_id in path("drafts.**"))]{
            underkategorier[
            urlparam == ${JSON.stringify(underkategoriUrlparam)} ][0]{
                soknadsobjekter[] -> {
                     _id, inngangtilsoknadsdialog, hovedskjema ->, tema->,
                     beskrivelse, digitalinnsending, gosysid,
                     innsendingsmate{spesifisertadresse->, skanning, visenheter}, lenker[], navn,
                    "vedleggtilsoknad": vedleggskjema[]{
                        _key, pakrevd, situasjon, beskrivelse, vedlegg->{
                            gosysid, kanskannes, skjematilvedlegg->,
                            vedleggsid, navn
                       }
                    }
                },
                soknadslenker[] -> {
                    ...
                }
            }
        }`;

const soknadsobjektKlageAnke = () =>
  `*[_type == "soknadsobjekt" && navn.nb == "Klage/anke" && !(_id in path("drafts.**"))][0]
      {hovedskjema->, "vedleggtilsoknad": vedleggskjema[]{
        vedlegg->{
          skjematilvedlegg->,
          ...
        },
        ...
      },
      ...
    }`;

const alleSoknadsobjekter = () =>
  `*[_type == "soknadsobjekt" && !(_id in path("drafts.**"))]
    {hovedskjema->{navn, skjemanummer, pdf
        {nb{asset->}, en{asset->}, nn{asset->}, se{asset->}, fr{asset->}, de{asset->}, pl{asset->}, es{asset->}
    }},
     tema->, gosysid, "vedleggtilsoknad": vedleggskjema[]{vedlegg->{gosysid, skjematilvedlegg->, vedleggsid}}}`;

const alleSkjemaer = () =>
  `*[_type == "skjema" && !(_id in path("drafts.**"))]
        {"emneord": emneord[]->{emneord}, skjemanummer, "navn": navn.nb,
        "pdf": pdf.nb}`;

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
                            gyldigtil, "navn": navn, pdf
                                {asset->{url}
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
  soknadsobjektKlageAnke,
  soknader,
  samlet
};