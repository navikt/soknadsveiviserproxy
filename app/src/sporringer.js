const alleKategorier = () =>
  `*[_type == "kategori" && !(_id in path("drafts.**"))]
    {tittel, urlparam, domene, "domenefarge":domenefarge.hex, "kantfarge":kantfarge.hex, underkategorier[]
    {navn, urlparam, lenketilhorlighet, inngangtilsoknadsdialog}}`;

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
                        pakrevd, situasjon, vedlegg->{
                            gosysid, kanskannes, skjematilvedlegg->,
                            vedleggsid, navn, beskrivelse
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
    {hovedskjema->{navn, skjemanummer, pdf{nb{asset->}, en{asset->}}},
     tema->, "vedleggtilsoknad": vedleggskjema[]{vedlegg->{gosysid, skjematilvedlegg->, vedleggsid}}}`;

const alleSkjemaer = () =>
  `*[_type == "skjema" && !(_id in path("drafts.**"))]
        {"emneord": emneord[]->{emneord}, skjemanummer, "navn": navn.nb,
        "pdf": pdf.nb}`;

const samlet = () =>
  `*[_type == "kategori" && !(_id in path("drafts.**"))]
        {"tittel": tittel.nb, urlparam, _id,  underkategorier[]
            {_id, "navn": navn.nb, inngangtilsoknadsdialog, urlparam,
                soknadsobjekter[]->
                {_id, digitalinnsending, "navn": navn.nb, tema, urlparam,
                    innsendingmate{spesifisertadresse->, skanning, visenheter}, hovedskjema->, "vedleggtilsoknad":
                    vedleggskjema[]
                    {"beskrivelse": beskrivelse.nb, pakrevd, vedlegg->
                        {gosysid, kanskannes, vedleggsid,
                        skjematilvedlegg->
                            {emneord, "beskrivelse": beskrivelse.nb,
                            "gyldigfra": gyldigfra.nb, "gyldigtil":
                            gyldigtil.nb, "navn": navn.nb, pdf
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
