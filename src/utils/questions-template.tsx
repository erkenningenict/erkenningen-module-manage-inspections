import { IQuestionType } from '../types/text-questions';

export function getTextQuestionTemplate(): IQuestionType[] {
  return [
    { question: 'Is de doelstelling bereikt:', answer: '' },
    { question: 'Aantal deelnemers:', answer: '' },
  ];
}
