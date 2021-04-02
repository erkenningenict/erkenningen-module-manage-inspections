import { IQuestionType } from '../inspections/create-report/CreateReport';

export function convertTextQuestionsToReport(textQuestions: IQuestionType): string {
  if (textQuestions === undefined) {
    return '';
  }
  let report = '<p>';
  Object.keys(textQuestions).map((key: string) => {
    report += `${key.replace(/_/g, ' ')}: ${textQuestions[key]}<BR/>`;
  });
  report += `</p>`;
  return report;
}
