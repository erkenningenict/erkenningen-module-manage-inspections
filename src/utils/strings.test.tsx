import { IQuestionType } from '../inspections/create-report/CreateReport';
import { convertTextQuestionsToReport } from './strings';

describe('strings', () => {
  describe('convertTextQuestionToReport', () => {
    it('should convert correctly', () => {
      const textQuestions: IQuestionType = {
        v01_Question_one: 'One',
        v02_Question_two: 'Two',
      };

      const res = convertTextQuestionsToReport(textQuestions);

      expect(res).toEqual(`<p>v01 Question one: One<BR/>v02 Question two: Two<BR/></p>`);
    });

    it('should convert undefined to empty string', () => {
      const textQuestions = undefined;

      const res = convertTextQuestionsToReport(textQuestions as any);

      expect(res).toEqual(``);
    });
  });
});
