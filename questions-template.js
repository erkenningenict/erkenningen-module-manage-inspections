const report = {
  meta: { version: '1' },
  textQuestionsTemplate: [
    {
      question: 'v01_Is_doelstelling_bereikt',
      label: 'Is doelstelling bereikt?',
      validation: 'yupTextQuestion',
    },
    {
      question: 'v02_Aantal_deelnemers',
      label: 'Aantal deelnemers?',
      validation: 'yupTextQuestion',
    },
    {
      question: 'v03_DocentenSLASHinleiders',
      label: 'Docenten / inleiders',
      validation: 'yupTextQuestion',
    },
    {
      question: 'v04_Bla',
      label: 'Bla vraag',
      validation: 'yupTextQuestion',
    },
  ],
  ratingsTemplate: [
    {
      categoryName: 'Uitvoering van doel en inhoud',
      weighing: 50,
      total: 0,
      rating: 0,
      version: '1',
      date: new Date(),
      questions: [
        {
          name: 'Beginsituatie deelnemers nagegaan',
          weighing: 5,
          rating: 0,
          remark: '',
          total: 0,
          version: '1',
          date: new Date(),
        },
        {
          name: 'Op_en_aanmerkingen_beoordelaar_verwerkt',
          weighing: 7,
          rating: 0,
          remark: '',
          total: 0,
          version: '1',
          date: new Date(),
        },
        {
          name: 'Doelstelling_behaald',
          weighing: 13,
          rating: 0,
          remark: '',
          total: 0,
          version: '1',
          date: new Date(),
        },
        {
          name: 'Voorgenomen_inhoud_behandeld',
          weighing: 25,
          rating: 0,
          remark: '',
          total: 0,
          version: '1',
          date: new Date(),
        },
      ],
    },
  ],
};

const str = JSON.stringify(report); /*?*/

JSON.parse(str); /*?*/
