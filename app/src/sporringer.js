const alleKategorier = () => {
  return `*[_type == "kategori" && !(_id in path("drafts.**"))]
    {tittel, urlparam, domene, "domenefarge":domenefarge.hex, "kantfarge":kantfarge.hex, underkategorier[]
    {navn, urlparam, lenketilhorlighet}}`;
};

const soknadsobjektsQuery = (kategoriUrlparam, underkategoriUrlparam) => {
  return `*[_type == "kategori"
    && urlparam == ${JSON.stringify(kategoriUrlparam)}
        && !(_id in path("drafts.**"))]{
            underkategorier[
            urlparam == ${JSON.stringify(underkategoriUrlparam)} ][0]{
                navn, inngangtilsoknadsdialog, soknadsobjekter[] -> {
                     inngangtilsoknadsdialog, hovedskjema ->, tema->,
                     beskrivelse, dokumentinnsending, gosysid,
                     innsendingsmate, lenker[], navn,
                    "vedleggtilsoknad": vedleggskjema[]{
                        pakrevd, situasjon, vedlegg->{
                            gosysid, kanskannes, skjematilvedlegg->,
                            vedleggsid, navn, beskrivelse
                       }
                    }
                }
            }
        }`;
};

const alleSoknadsobjekterQuery = () => {
  return `*[_type == "soknadsobjekt" && !(_id in path("drafts.**"))]
    {hovedskjema->{navn, skjemanummer, pdf{nb{asset->}, en{asset->}}},
     tema->, "vedleggtilsoknad": vedleggskjema[]{vedlegg->{gosysid, skjematilvedlegg->, vedleggsid}}}`;
};

const alleskjemaerQuery = () => {
  return `*[_type == "skjema" && !(_id in path("drafts.**"))]
        {"emneord": emneord[]->{emneord}, skjemanummer, "navn": navn.nb,
        "pdf": pdf.nb}`;
};

const samleQuery = () => {
  return `*[_type == "kategori" && !(_id in path("drafts.**"))]
        {"tittel": tittel.nb, urlparam, _id,  underkategorier[]
            {_id, "navn": navn.nb, inngangtilsoknadsdialog, urlparam,
                soknadsobjekter[]->
                {_id, dokumentinnsending, "navn": navn.nb, tema, urlparam,
                    innsendingmate, hovedskjema->, "vedleggtilsoknad":
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
};

module.exports = {
  alleKategorier,
  soknadsobjektsQuery,
  alleSoknadsobjekterQuery,
  alleskjemaerQuery,
  samleQuery,
};
