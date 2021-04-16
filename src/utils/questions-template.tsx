import { IQuestionType } from '../types/text-questions';

export function getTextQuestionTemplate(): IQuestionType[] {
  return [
    { question: 'Is doelstelling behaald?', answer: '' },
    { question: 'Test2', answer: '' },
  ];
}
