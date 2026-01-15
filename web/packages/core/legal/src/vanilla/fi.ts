import type { LegalSnippet, LegalTemplate } from "../types";

export const vanillaSnippetsFi: Record<string, LegalSnippet> = {
  "terms.introduction": {
    id: "terms.introduction",
    blocks: [
      {
        type: "paragraph",
        text: "Tervetuloa palveluun {{SERVICE_NAME}} (\"me\", \"meitä\", \"meidän\").",
      },
      {
        type: "paragraph",
        text:
          "Lue nämä käyttöehdot (\"Ehdot\") huolellisesti ennen kuin käytät {{SERVICE_NAME}}-verkkosivustoa, sovelluksia ja niihin liittyviä palveluja (yhdessä \"Palvelu\").",
      },
      {
        type: "paragraph",
        text:
          "Käyttämällä Palvelua sitoudut noudattamaan näitä Ehtoja sekä [tietosuojakäytäntöämme](/privacy). Jos et hyväksy Ehtoja, älä käytä Palvelua.",
      },
    ],
  },
  "terms.definitions": {
    id: "terms.definitions",
    blocks: [
      {
        id: "terms-definitions",
        type: "table",
        headers: ["Termi", "Merkitys"],
        rows: [
          ["Tili", "Käyttäjäprofiili, joka luodaan Palvelun käyttöä varten."],
          ["Sisältö", "Data, teksti, kuvat, palaute ja muu materiaali, jonka lähetät Palvelun kautta."],
          ["Tilaus", "Maksullinen paketti, joka antaa määräaikaisen pääsyn premium-ominaisuuksiin."],
        ],
      },
    ],
  },
  "terms.eligibility": {
    id: "terms.eligibility",
    blocks: [
      {
        type: "paragraph",
        text:
          "Sinun on oltava vähintään 18-vuotias (tai täysi-ikäinen omassa lainkäyttöalueessasi) ja sinulla tulee olla valtuudet solmia nämä Ehdot itsesi tai organisaatiosi puolesta.",
      },
    ],
  },
  "terms.account": {
    id: "terms.account",
    blocks: [
      {
        type: "list",
        items: [
          "Anna paikkansapitävät tiedot ja pidä ne ajan tasalla.",
          "Säilytä tunnistetietosi luottamuksellisina; vastaat kaikesta Tililläsi tapahtuvasta toiminnasta.",
          "Voimme keskeyttää tai sulkea Tilejä, jotka rikkovat näitä Ehtoja.",
        ],
      },
    ],
  },
  "terms.service": {
    id: "terms.service",
    blocks: [
      {
        type: "list",
        items: [
          "{{SERVICE_DESCRIPTION}}",
          "Voimme muuttaa tai lopettaa ominaisuuksia milloin tahansa kohtuullisella ilmoitusajalla.",
        ],
      },
    ],
  },
  "terms.fees": {
    id: "terms.fees",
    blocks: [
      {
        type: "list",
        items: [
          "Tietyt ominaisuudet edellyttävät Tilausta, joka laskutetaan etukäteen toistuvasti (esim. kuukausittain tai vuosittain).",
          "Hinnat esitetään arvonlisävero mukaan lukien, jos se on sovellettavissa.",
          "Maksut käsittelee {{PAYMENTS_PROVIDER}}; emme tallenna täydellisiä korttitietoja.",
          "Tilaukset uusiutuvat automaattisesti, ellei niitä peruuteta ennen kuluvan laskutuskauden päättymistä.",
          "Voit peruuttaa koska tahansa; osittaisista kausista ei palauteta maksuja, ellei laki sitä vaadi.",
        ],
      },
    ],
  },
  "terms.acceptableUse": {
    id: "terms.acceptableUse",
    blocks: [
      {
        type: "paragraph",
        text: "Sitoudut olemaan:",
      },
      {
        type: "list",
        items: [
          "Lataamatta laitonta, vahingollista tai oikeuksia loukkaavaa Sisältöä.",
          "Yrittämättä häiritä tai purkaa Palvelun toimintaa tai koodia.",
          "Käyttämättä Palvelua henkilötietojen tallentamiseen tai siirtämiseen ilman laillista perustetta.",
          "Antamatta vääriä tietoja yhteydestäsi tai esiintymättä toisena henkilönä.",
        ],
      },
      {
        type: "paragraph",
        text: "Pidätämme oikeuden poistaa Sisältöä tai keskeyttää Tilejä, jotka rikkovat tätä kohtaa.",
      },
    ],
  },
  "terms.intellectualProperty": {
    id: "terms.intellectualProperty",
    blocks: [
      {
        type: "list",
        items: [
          "Omistusoikeus: Palvelu sekä kaikki ohjelmistot, tavaramerkit ja muu sisältö (pois lukien käyttäjien Sisältö) ovat meidän tai lisenssinantajiemme omaisuutta.",
          "Lisenssi: Myönnämme sinulle ei-yksinomaisen, siirto-oikeudettoman oikeuden käyttää Palvelua Tilauskauden aikana.",
          "Käyttäjän Sisältö: Säilytät kaikki oikeudet lataamaasi Sisältöön. Myönnät meille maailmanlaajuisen, ei-yksinomaisen lisenssin isännöidä ja käsitellä Sisältöä Palvelun tuottamiseksi.",
        ],
      },
    ],
  },
  "terms.thirdParties": {
    id: "terms.thirdParties",
    blocks: [
      {
        type: "paragraph",
        text:
          "Palvelu voi integroitua kolmannen osapuolen työkaluihin (esim. analytiikka, maksupalvelut). Näiden palveluiden käyttöä säätelevät niiden omat käyttöehdot ja tietosuojakäytännöt.",
      },
    ],
  },
  "terms.termination": {
    id: "terms.termination",
    blocks: [
      {
        type: "list",
        items: [
          "Voit päättää Tilauksesi kojelaudan kautta tai ottamalla yhteyttä tukeen.",
          "Voimme keskeyttää tai sulkea Palvelun (kohtuullisella ilmoitusajalla), jos rikot näitä Ehtoja tai jätät maksut suorittamatta.",
          "Irtisanomisen jälkeen oikeutesi käyttää Palvelua lakkaa välittömästi ja voimme poistaa Sisältösi 30 päivän kuluttua.",
        ],
      },
    ],
  },
  "terms.disclaimers": {
    id: "terms.disclaimers",
    blocks: [
      {
        type: "paragraph",
        text:
          "Palvelu tarjotaan \"sellaisena kuin se on\" ja \"saatavuuden mukaan\" ilman minkäänlaisia nimenomaisia tai hiljaisia takuita.",
      },
      {
        type: "paragraph",
        text: "Emme takaa, että Palvelu on keskeytyksetön, virheetön tai täyttää erityiset vaatimuksesi.",
      },
    ],
  },
  "terms.liability": {
    id: "terms.liability",
    blocks: [
      {
        type: "paragraph",
        text: "Sovellettavan lain sallimissa rajoissa:",
      },
      {
        type: "list",
        items: [
          "Kokonaisvastuumme mistä tahansa vaateesta näiden Ehtojen perusteella ei ylitä viimeisen 12 kuukauden aikana maksamiesi maksujen yhteismäärää.",
          "Emme vastaa epäsuorista, satunnaisista, erityisistä, seurannaisista tai rangaistusluonteisista vahingoista.",
        ],
      },
      {
        type: "paragraph",
        text:
          "Mikään näissä Ehdoissa ei rajoita vastuuta törkeästä huolimattomuudesta, tahallisesta väärinkäytöstä tai vastuusta, jota ei voida lain mukaan rajoittaa (esim. kuluttajansuoja).",
      },
    ],
  },
  "terms.indemnification": {
    id: "terms.indemnification",
    blocks: [
      {
        type: "paragraph",
        text:
          "Sitoudut korvaamaan meille kaikki vaateet, kustannukset ja vahingot, jotka johtuvat näiden Ehtojen rikkomisesta tai Palvelun väärinkäytöstäsi.",
      },
    ],
  },
  "terms.governingLaw": {
    id: "terms.governingLaw",
    blocks: [
      {
        type: "list",
        items: [
          "Näihin Ehtoihin sovelletaan {{GOVERNING_LAW}} lakia poissulkien lainvalintasäännökset.",
          "Mahdolliset riidat ratkaistaan yksinomaan {{GOVERNING_VENUE}} käräjäoikeudessa.",
          "EU-kuluttajat voivat myös käyttää EU:n verkkovälitteistä riidanratkaisufoorumia.",
        ],
      },
    ],
  },
  "terms.changes": {
    id: "terms.changes",
    blocks: [
      {
        type: "paragraph",
        text:
          "Voimme päivittää näitä Ehtoja ajoittain. Olennaisista muutoksista ilmoitetaan 14 päivää etukäteen sähköpostitse ja/tai sovelluksen sisäisesti. Palvelun käyttäminen muutosten jälkeen merkitsee hyväksyntää.",
      },
    ],
  },
  "terms.contact": {
    id: "terms.contact",
    blocks: [
      {
        type: "paragraph",
        text: "Kysyttävää? Ota yhteyttä [yhteydenottolomakkeella]({{CONTACT_URL}}).",
      },
    ],
  },
  "privacy.whoWeAre": {
    id: "privacy.whoWeAre",
    blocks: [
      {
        type: "paragraph",
        text:
          "EU:n yleisen tietosuoja-asetuksen (GDPR) ja sovellettavan kansallisen tietosuojalainsäädännön mukaisesti {{COMPANY_NAME}} ({{SERVICE_NAME}}, \"me\", \"meidän\" tai \"meitä\") toimii tämän käytännön mukaisten käsittelytoimien rekisterinpitäjänä.",
      },
      {
        type: "note",
        text: "Yhteystiedot: [yhteydenottolomake]({{CONTACT_URL}})\nOsoite: {{COMPANY_ADDRESS}}",
      },
    ],
  },
  "privacy.dataWeCollect": {
    id: "privacy.dataWeCollect",
    blocks: [
      {
        id: "privacy-data-collection",
        type: "table",
        headers: ["Luokka", "Esimerkit", "Tarkoitus", "Oikeusperuste"],
        rows: [],
      },
      {
        type: "paragraph",
        text: "Emme tietoisesti kerää nimiä, puhelinnumeroita tai tarkkoja sijaintitietoja loppukäyttäjien toiminnasta.",
      },
    ],
  },
  "privacy.dataWeCollect.service": {
    id: "privacy.dataWeCollect.service",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "{{SERVICE_DATA_CATEGORY}}",
          "{{SERVICE_DATA_EXAMPLES}}",
          "Palvelun ydintoiminnot",
          "Art. 6(1)(b) - Sopimuksen täytäntöönpano",
        ],
      ],
    },
  },
  "privacy.dataWeCollect.payments": {
    id: "privacy.dataWeCollect.payments",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "Maksutiedot ({{PAYMENTS_PROVIDER}})",
          "Korttitunniste, 4 viimeistä numeroa, laskutusosoite, ALV-tunnus",
          "Tilauksen veloitus ja verovelvoitteiden täyttäminen",
          "Art. 6(1)(b) - Sopimus ja Art. 6(1)(c) - Lakisääteinen velvoite",
        ],
      ],
    },
  },
  "privacy.dataWeCollect.usage": {
    id: "privacy.dataWeCollect.usage",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "Laite- ja käyttötiedot",
          "Selaimen UA-merkkijono, käyttöjärjestelmä, IP (lyhennetty), sivut",
          "Palvelun suojaus, virheenkorjaus, koontimittarit",
          "Art. 6(1)(f) - Oikeutettu etu",
        ],
      ],
    },
  },
  "privacy.dataWeCollect.email": {
    id: "privacy.dataWeCollect.email",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "Sähköposti (vapaaehtoinen)",
          "Uutiskirje- tai yhteydenottolomakkeelle syötetty osoite",
          "Tuoteuutiset ja pyyntöihin vastaaminen",
          "Art. 6(1)(a) - Suostumus",
        ],
      ],
    },
  },
  "privacy.dataWeCollect.cookies": {
    id: "privacy.dataWeCollect.cookies",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "Evästeet",
          "__session, __clerk*, __stripe*",
          "Istunnon hallinta, tietoturva ja mieltymykset",
          "Art. 6(1)(f) tai Art. 6(1)(a) luokasta riippuen",
        ],
      ],
    },
  },
  "privacy.useOfData": {
    id: "privacy.useOfData",
    blocks: [
      {
        type: "list",
        items: [
          "Palvelun perustoiminnot - {{SERVICE_DESCRIPTION}}",
          "Maksujen ja laskujen käsittely {{PAYMENTS_PROVIDER}}n kautta.",
          "Palvelun kehittäminen anonymisoitujen trendien avulla.",
          "Tietoturva ja väärinkäytösten ehkäisy.",
          "Markkinointiviestit vain suostumuksella.",
        ],
      },
      {
        type: "paragraph",
        text:
          "Emme myy henkilötietoja. Jaamme niitä vain käsittelijöillemme ja, suostumuksellasi, rajatuille analytiikka- tai mainontakumppaneille—ei koskaan heidän omaan jälleenmyyntiinsä.",
      },
    ],
  },
  "privacy.subprocessors": {
    id: "privacy.subprocessors",
    blocks: [
      {
        id: "privacy-subprocessors",
        type: "table",
        headers: ["Palvelu", "Käyttötarkoitus", "Alue", "Suojauskeino"],
        rows: [],
      },
      {
        type: "paragraph",
        text:
          "Tallennamme ja käsittelemme tietoja ensisijaisesti alueella {{DATA_REGION_PRIMARY}}. Osa palveluntarjoajista voi käsitellä tai varmuuskopioida tietoja alueen ulkopuolella (esimerkiksi {{DATA_REGION_BACKUP}}); tällöin käytämme suojakeinoja kuten EU:n vakiolausekkeita (SCC) tai riittävyyspäätöstä (GDPR Art. 45-46).",
      },
    ],
  },
  "privacy.subprocessors.auth": {
    id: "privacy.subprocessors.auth",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Clerk", "Käyttäjäautentikointi ja tilit", "{{DATA_REGION_PRIMARY}}", "DPA + SCC-lausekkeet"]],
    },
  },
  "privacy.subprocessors.payments": {
    id: "privacy.subprocessors.payments",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [
        [
          "{{PAYMENTS_PROVIDER}}",
          "Tilaukset ja maksujen käsittely",
          "{{DATA_REGION_PRIMARY}} (ensisijainen), {{DATA_REGION_BACKUP}} (varmistus)",
          "DPA + SCC + PSD2",
        ],
      ],
    },
  },
  "privacy.subprocessors.hosting": {
    id: "privacy.subprocessors.hosting",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Vercel", "Verkkopalvelu ja edge-hosting", "{{DATA_REGION_PRIMARY}}", "DPA + SCC"]],
    },
  },
  "privacy.subprocessors.db": {
    id: "privacy.subprocessors.db",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Neon", "Tietokanta", "{{DATA_REGION_PRIMARY}}", "DPA + SCC"]],
    },
  },
  "privacy.subprocessors.email": {
    id: "privacy.subprocessors.email",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Resend", "Transaktio- ja markkinointisähköpostit", "{{DATA_REGION_PRIMARY}}", "DPA + SCC"]],
    },
  },
  "privacy.subprocessors.analytics": {
    id: "privacy.subprocessors.analytics",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Umami Analytics", "Tietosuojaystävällinen analytiikka", "{{DATA_REGION_PRIMARY}}", "Ei evästeitä tai henkilötietoja"]],
    },
  },
  "privacy.subprocessors.googleAds": {
    id: "privacy.subprocessors.googleAds",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Google Ireland", "Google Ads (jos käytössä)", "{{DATA_REGION_PRIMARY}}", "DPA + SCC"]],
    },
  },
  "privacy.subprocessors.meta": {
    id: "privacy.subprocessors.meta",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Meta Platforms Ireland", "Meta Pixel (jos käytössä)", "{{DATA_REGION_PRIMARY}}", "DPA + SCC"]],
    },
  },
  "privacy.subprocessors.linkedin": {
    id: "privacy.subprocessors.linkedin",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["LinkedIn Ireland", "Insight Tag (jos käytössä)", "{{DATA_REGION_PRIMARY}}", "DPA + SCC"]],
    },
  },
  "privacy.retention": {
    id: "privacy.retention",
    blocks: [
      {
        id: "privacy-retention",
        type: "table",
        headers: ["Tietotyyppi", "Säilytysaika"],
        rows: [],
      },
    ],
  },
  "privacy.retention.service": {
    id: "privacy.retention.service",
    tableRows: {
      tableId: "privacy-retention",
      rows: [["{{SERVICE_DATA_TYPE}}", "{{SERVICE_DATA_TYPE_DESCRIPTION}}"]],
    },
  },
  "privacy.retention.newsletter": {
    id: "privacy.retention.newsletter",
    tableRows: {
      tableId: "privacy-retention",
      rows: [["Uutiskirjeosoitteet", "Kunnes peruutat tilauksen"]],
    },
  },
  "privacy.retention.logs": {
    id: "privacy.retention.logs",
    tableRows: {
      tableId: "privacy-retention",
      rows: [["Virhelokit", "30 päivää"]],
    },
  },
  "privacy.retention.analytics": {
    id: "privacy.retention.analytics",
    tableRows: {
      tableId: "privacy-retention",
      rows: [["Analytiikkaistunto ID", "Tallennetaan selaimeen; ei tunnistettavissa palvelimella"]],
    },
  },
  "privacy.rights": {
    id: "privacy.rights",
    blocks: [
      {
        type: "list",
        items: [
          "Saada pääsy henkilötietoihisi",
          "Oikaista virheelliset tiedot",
          "Poistaa tiedot (oikeus tulla unohdetuksi)",
          "Rajoittaa tai vastustaa käsittelyä",
          "Siirtää tiedot järjestelmästä toiseen",
          "Perua suostumus milloin tahansa (uutiskirjeet, ei-välttämättömät evästeet)",
        ],
      },
      {
        type: "note",
        text: "Näin toimit: Lähetä pyyntö [yhteydenottolomakkeella]({{CONTACT_URL}}). Vastaamme 30 päivän kuluessa.",
      },
      {
        type: "paragraph",
        text:
          "Jos koet, että oikeuksiasi on loukattu, voit tehdä valituksen Tietosuojavaltuutetun toimistolle tai omalle valvontaviranomaisellesi.",
      },
    ],
  },
  "privacy.security": {
    id: "privacy.security",
    blocks: [
      {
        type: "list",
        items: [
          "Lepotilassa: AES-256 -salaus.",
          "Siirrossa: TLS 1.3.",
          "Käsittelyssä: tietoturvallinen ohjelmointi ja pääsynhallinta (OWASP Top 10).",
        ],
      },
    ],
  },
  "privacy.cookies": {
    id: "privacy.cookies",
    blocks: [
      {
        type: "paragraph",
        text:
          "Käytämme evästeitä ydintoimintoihin, analytiikkaan ja suostumuksellasi personoituun mainontaan. Yksityiskohdat ja nykyiset valintasi löytyvät [evästekäytännöstä](/cookies).",
      },
    ],
  },
  "privacy.changes": {
    id: "privacy.changes",
    blocks: [
      {
        type: "paragraph",
        text:
          "Päivitämme asiakirjaa, kun käsittelytoimet tai alikäsittelijät muuttuvat. Merkittävistä muutoksista ilmoitetaan 14 päivää etukäteen sovelluksessa ja/tai sähköpostitse.",
      },
    ],
  },
  "privacy.contact": {
    id: "privacy.contact",
    blocks: [
      {
        type: "paragraph",
        text: "Kysyttävää? Ota yhteyttä [yhteydenottolomakkeella]({{CONTACT_URL}}).",
      },
    ],
  },
  "cookies.introduction": {
    id: "cookies.introduction",
    blocks: [
      {
        type: "paragraph",
        text:
          "Tämä evästekäytäntö selittää, miten {{SERVICE_NAME}} (\"me\", \"meidän\") käyttää evästeitä ja vastaavia tekniikoita, kun vierailet verkkosivustoillamme ja sovelluksissamme (\"Palvelu\").",
      },
      {
        type: "paragraph",
        text: "Lue tämä asiakirja yhdessä [tietosuojakäytäntömme](/privacy) kanssa.",
      },
    ],
  },
  "cookies.definition": {
    id: "cookies.definition",
    blocks: [
      {
        type: "paragraph",
        text:
          "Evästeet ovat pieniä tekstitiedostoja, jotka tallennetaan laitteellesi. Ne mahdollistavat sivuston ydintoiminnot, auttavat meitä ymmärtämään palvelumme käyttöä, mahdollistavat sosiaalisia toimintoja ja näyttävät kohdennettuja mainoksia.",
      },
    ],
  },
  "cookies.usage": {
    id: "cookies.usage",
    blocks: [
      {
        id: "cookies-categories",
        type: "table",
        headers: ["Luokka", "Tyypilliset evästenimet", "Tarkoitus", "Suostumus?", "Voimassaoloaika"],
        rows: [],
      },
      {
        type: "note",
        text:
          "Tarkka voimassaoloaika voi vaihdella palveluntarjoajasta riippuen.\nTäydellinen luettelo (nimi, tarjoaja, voimassaolo) on nähtävissä Evästeasetukset-paneelissa.",
      },
    ],
  },
  "cookies.usage.strict": {
    id: "cookies.usage.strict",
    tableRows: {
      tableId: "cookies-categories",
      rows: [
        [
          "Välttämättömät",
          "__client*, __clerk*, clerk*, __session, __stripe*, __refresh*",
          "Sisäänkirjautuminen, tietoturva, kuormanjako, maksut",
          "Ei vaadita",
          "1 vuosi",
        ],
      ],
    },
  },
  "cookies.usage.preferences": {
    id: "cookies.usage.preferences",
    tableRows: {
      tableId: "cookies-categories",
      rows: [
        [
          "Mieltymykset",
          "cookie_preferences, theme, locale",
          "Muistaa käyttöliittymä- ja evästevalinnat",
          "Kyllä",
          "1 vuosi",
        ],
      ],
    },
  },
  "cookies.usage.advertising": {
    id: "cookies.usage.advertising",
    tableRows: {
      tableId: "cookies-categories",
      rows: [["Mainonta", "_gads, _gcl_au, _fbp", "Kohdennetut mainokset", "Kyllä", "3-24 kk"]],
    },
  },
  "cookies.usage.social": {
    id: "cookies.usage.social",
    tableRows: {
      tableId: "cookies-categories",
      rows: [["Sosiaalinen / pikselit", "bcookie, li_gc, fr", "Sosiaalisen median kampanjoiden mittaus", "Kyllä", "3-12 kk"]],
    },
  },
  "cookies.choices": {
    id: "cookies.choices",
    blocks: [
      {
        type: "list",
        items: [
          "Ensikäynti - lataamme vain välttämättömät evästeet.",
          "Muuta mieltäsi milloin tahansa - löydät alatunnisteesta Evästekäytäntö-linkin, jonka kautta voit päivittää valintasi tai perua suostumuksen.",
          "Selainasetukset - voit poistaa tai estää evästeitä selaimesi kautta (Chrome, Firefox, Safari).",
        ],
      },
    ],
  },
  "cookies.thirdParty": {
    id: "cookies.thirdParty",
    blocks: [
      {
        type: "paragraph",
        text:
          "Käytämme luotettavia kumppaneita; heidän evästeensä aktivoituvat vasta, kun olet antanut suostumuksen kyseiseen luokkaan.",
      },
      {
        id: "cookies-third-party",
        type: "table",
        headers: ["Tarjoaja", "Palvelu", "Alue", "Suojauskeino"],
        rows: [],
      },
    ],
  },
  "cookies.thirdParty.googleAds": {
    id: "cookies.thirdParty.googleAds",
    tableRows: {
      tableId: "cookies-third-party",
      rows: [["Google Ireland", "Google Ads (Consent Mode v2)", "EU ensisijainen, US varmistus", "SCC"]],
    },
  },
  "cookies.thirdParty.meta": {
    id: "cookies.thirdParty.meta",
    tableRows: {
      tableId: "cookies-third-party",
      rows: [["Meta Platforms Ireland", "Meta Pixel (jos käytössä)", "EU", "SCC"]],
    },
  },
  "cookies.thirdParty.linkedin": {
    id: "cookies.thirdParty.linkedin",
    tableRows: {
      tableId: "cookies-third-party",
      rows: [["LinkedIn Ireland", "Insight Tag (jos käytössä)", "EU", "SCC"]],
    },
  },
  "cookies.thirdParty.payments": {
    id: "cookies.thirdParty.payments",
    tableRows: {
      tableId: "cookies-third-party",
      rows: [
        [
          "{{PAYMENTS_PROVIDER}}",
          "Maksuistuntojen evästeet",
          "{{DATA_REGION_PRIMARY}} ensisijainen, {{DATA_REGION_BACKUP}} varmistus",
          "PSD2, SCC",
        ],
      ],
    },
  },
  "cookies.retention": {
    id: "cookies.retention",
    blocks: [
      {
        type: "paragraph",
        text: "Evästeiden voimassaoloajat on lueteltu tällä sivulla.",
      },
    ],
  },
  "cookies.updates": {
    id: "cookies.updates",
    blocks: [
      {
        type: "paragraph",
        text: "Saatamme muokata tätä käytäntöä evästeiden, palveluntarjoajien tai lainsäädännön muuttuessa.",
      },
    ],
  },
  "cookies.contact": {
    id: "cookies.contact",
    blocks: [
      {
        type: "paragraph",
        text: "Kysyttävää? Ota yhteyttä [yhteydenottolomakkeella]({{CONTACT_URL}}).",
      },
    ],
  },
};

export const vanillaTemplatesFi: Record<string, LegalTemplate> = {
  terms: {
    slug: "terms",
    title: "Käyttöehdot",
    summary: "Lue nämä käyttöehdot huolellisesti ennen kuin käytät {{SERVICE_NAME}}-palvelua.",
    sections: [
      { id: "introduction", title: "Johdanto", snippetIds: ["terms.introduction"] },
      { id: "definitions", title: "1. Määritelmät", snippetIds: ["terms.definitions"] },
      { id: "eligibility", title: "2. Kelpoisuus", snippetIds: ["terms.eligibility"] },
      { id: "account-registration", title: "3. Tilin rekisteröinti", snippetIds: ["terms.account"] },
      { id: "service", title: "4. Palvelu", snippetIds: ["terms.service"] },
      { id: "fees", title: "5. Maksut ja tilaushinnat", snippetIds: ["terms.fees"] },
      { id: "acceptable-use", title: "6. Hyväksyttävä käyttö", snippetIds: ["terms.acceptableUse"] },
      { id: "intellectual-property", title: "7. Immateriaalioikeudet", snippetIds: ["terms.intellectualProperty"] },
      { id: "third-parties", title: "8. Kolmannen osapuolen palvelut", snippetIds: ["terms.thirdParties"] },
      { id: "termination", title: "9. Irtisanominen", snippetIds: ["terms.termination"] },
      { id: "disclaimers", title: "10. Vastuuvapauslauseke", snippetIds: ["terms.disclaimers"] },
      { id: "liability", title: "11. Vastuunrajoitus", snippetIds: ["terms.liability"] },
      { id: "indemnification", title: "12. Vahingonkorvausvelvollisuus", snippetIds: ["terms.indemnification"] },
      { id: "governing-law", title: "13. Sovellettava laki ja riidanratkaisu", snippetIds: ["terms.governingLaw"] },
      { id: "changes", title: "14. Ehtojen muutokset", snippetIds: ["terms.changes"] },
      { id: "contact", title: "15. Yhteydenotto", snippetIds: ["terms.contact"] },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Tietosuojakäytäntö",
    summary: "Miten {{SERVICE_NAME}} käsittelee tietojasi.",
    sections: [
      { id: "who-we-are", title: "1. Keitä olemme", snippetIds: ["privacy.whoWeAre"] },
      { id: "data-we-collect", title: "2. Mitä tietoja keräämme", snippetIds: ["privacy.dataWeCollect"] },
      { id: "use-of-data", title: "3. Miten käytämme tietojasi", snippetIds: ["privacy.useOfData"] },
      { id: "subprocessors", title: "4. Alikäsittelijät ja sijainti", snippetIds: ["privacy.subprocessors"] },
      { id: "retention", title: "5. Säilytysajat", snippetIds: ["privacy.retention"] },
      { id: "rights", title: "6. Oikeutesi (GDPR Art. 12-23)", snippetIds: ["privacy.rights"] },
      { id: "security", title: "7. Tietoturva", snippetIds: ["privacy.security"] },
      { id: "cookies", title: "8. Evästeet ja vastaavat tekniikat", snippetIds: ["privacy.cookies"] },
      { id: "changes", title: "9. Muutokset tähän käytäntöön", snippetIds: ["privacy.changes"] },
      { id: "contact", title: "10. Yhteydenotto", snippetIds: ["privacy.contact"] },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Evästekäytäntö",
    summary: "Miten {{SERVICE_NAME}} käyttää evästeitä ja vastaavia tekniikoita.",
    sections: [
      { id: "introduction", title: "Johdanto", snippetIds: ["cookies.introduction"] },
      { id: "what-are-cookies", title: "1. Mitä evästeet ovat?", snippetIds: ["cookies.definition"] },
      { id: "how-we-use", title: "2. Miten käytämme evästeitä", snippetIds: ["cookies.usage"] },
      { id: "choices", title: "3. Kuinka hallitset valintojasi", snippetIds: ["cookies.choices"] },
      { id: "third-party", title: "4. Kolmannen osapuolen evästeet", snippetIds: ["cookies.thirdParty"] },
      { id: "retention", title: "5. Säilytys", snippetIds: ["cookies.retention"] },
      { id: "updates", title: "6. Päivitykset", snippetIds: ["cookies.updates"] },
      { id: "contact", title: "7. Yhteydenotto", snippetIds: ["cookies.contact"] },
    ],
  },
};
