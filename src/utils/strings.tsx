import { IQuestionType } from '../types/text-questions';

export function convertTextQuestionsToReport(textQuestions: IQuestionType[]): string {
  if (textQuestions === undefined) {
    return '';
  }
  let report = '<p>';
  textQuestions.map((q) => {
    report += `${q.question}: ${q.answer}<BR/>`;
  });
  report += `</p>`;
  return report;
}
