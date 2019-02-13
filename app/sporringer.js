
const alleKategorier = () => {
    let locale = 'nb'; // temp, skal hente begge sprak
    return `*[_type == "kategori" && !(_id in path("drafts.**"))]
    {"tittel": tittel.${locale}, urlparam, domene, underkategorier[]
    {"navn": navn.${locale}, urlparam, lenketilhorlighet}}`;
};

const underkategori =
    (kategoriUrlparam, underkategoriUrlparam) => {
    let locale = 'nb'; // temp, skal hente begge sprak
        return (
            `*[_type == "kategori" 
            && urlparam == ${JSON.stringify(kategoriUrlparam)} 
            && !(_id in path("drafts.**"))]
            {"underkategori": underkategorier
                [ urlparam == ${JSON.stringify(underkategoriUrlparam)} ][0]
                    {"navn": navn.${locale}, inngangtilsoknadsdialog
                        {"soknadsdialogURL": soknadsdialogURL.${locale}, 
                        lenker[]{"lenke" : lenke.${locale}, 
                        "tekst" : tekst.${locale}
                    }, punktliste[]{"punkt" : ${locale}}
                }, soknadsobjekter}
            }.underkategori`
        );
    };

const soknadsobjektsQuery = (kategoriUrlparam, underkategoriUrlparam) => {
    return (`*[_type == "kategori" 
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
        }`
    );
};

const alleskjemaerQuery = () => {
    return (`*[_type == "skjema" && !(_id in path("drafts.**"))]
        {"emneord": emneord[]->{emneord}, skjemanummer, "navn": navn.nb, 
        "pdf": pdf.nb}`
    );
};

const samleQuery = () => {
    return (`*[_type == "kategori" && !(_id in path("drafts.**"))]
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
        }`
    );
};

module.exports = {alleKategorier, soknadsobjektsQuery, underkategori,
    alleskjemaerQuery, samleQuery};
