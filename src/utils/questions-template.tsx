import { IQuestionType } from '../types/text-questions';

export function getTextQuestionTemplate(): IQuestionType[] {
  return [{ question: 'Is doelstelling behaald?', answer: '' }];
}
