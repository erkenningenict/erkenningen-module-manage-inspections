import { IQuestionType } from '../types/text-questions';

export function getTextQuestionTemplate(): IQuestionType[] {
  return [
    { question: 'Is de doelstelling bereikt', answer: '' },
    { question: 'Aantal deelnemers', answer: '' },
    { question: 'Docenten/inleiders', answer: '' },
    { question: 'Lokatie in relatie tot doelstelling', answer: '' },
    {
      question: 'Wordt binnen de competentie gewerkt en worden de genoemde vaardigheden behandeld',
      answer: '',
    },
    { question: 'Hulpmiddelen en toepassingswijze', answer: '' },
    { question: 'Kwaliteit van samenvatting', answer: '' },
    { question: 'Aanvullende opmerkingen', answer: '' },
  ];
}

export function getTextQuestionForDigitalSpecialtyTemplate(): IQuestionType[] {
  return [
    { question: 'Administratieve intake', answer: '' },
    { question: 'Inrichting persoonsverificatie', answer: '' },
    { question: 'Afhandeling forum bijdrage', answer: '' },
    { question: 'Verwerking voltooide deelnemers', answer: '' },
    { question: 'Opmerkingen', answer: '' },
  ];
}
