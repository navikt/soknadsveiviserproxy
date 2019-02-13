const createSanityClient = require('./createSanityClient');

test('Oppretter sanityclient og får gjennomført et kall som returnerer []',
    () => {
    return createSanityClient()
        .fetch('*[_type == "eksisterer_ikke"]')
        .then((docs) => {
            expect(docs).toEqual([]);
    });
});

