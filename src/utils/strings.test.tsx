import { IQuestionType } from '../types/text-questions';
import { convertTextQuestionsToReport } from './strings';

describe('strings', () => {
  describe('convertTextQuestionToReport', () => {
    it('should convert correctly', () => {
      const textQuestions: IQuestionType[] = [
        { question: 'One', answer: 'uno' },
        { question: 'Two', answer: 'dos' },
      ];

      const res = convertTextQuestionsToReport(textQuestions);

      expect(res).toEqual(`<p>One: uno<BR/>Two: dos<BR/></p>`);
    });

    it('should convert undefined to empty string', () => {
      const textQuestions = undefined;

      const res = convertTextQuestionsToReport(textQuestions as any);

      expect(res).toEqual(``);
    });
  });
});
