import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { UseFormRegister, useFieldArray, Control } from 'react-hook-form';
import { VisitatieBeoordelingCategorieInput } from '../../generated/graphql';
import { IQuestionType } from '../../types/text-questions';

const TextQuestions: React.FC<{
  register: UseFormRegister<{
    textQuestions: IQuestionType[];
    ratings: VisitatieBeoordelingCategorieInput[];
  }>;
  errors: any;
  control: Control<{
    textQuestions: IQuestionType[];
    ratings: VisitatieBeoordelingCategorieInput[];
  }>;
  isReadOnly: boolean;
}> = ({ register, errors, control, isReadOnly }) => {
  const { fields } = useFieldArray({
    name: 'textQuestions' as `textQuestions`,
    control,
  });
  return (
    <>
      {fields?.map((field, index) => (
        <div
          className={`form-group ${
            errors?.textQuestions && errors?.textQuestions[index]?.answer ? 'has-error' : ''
          }`}
          key={field.id}
        >
          <label className="control-label col-sm-4">{(field as any).question}</label>
          <div className="col-sm-8">
            {isReadOnly && <div className="form-control-static">{(field as any).answer}</div>}
            {!isReadOnly && (
              <>
                <input
                  {...register(`textQuestions.${index}.question` as `textQuestions.0.question`)}
                  className="hidden"
                />
                <TextareaAutosize
                  className="form-control"
                  readOnly={isReadOnly}
                  placeholder={`${(field as any).question}`}
                  {...register(`textQuestions.${index}.answer` as `textQuestions.0.answer`)}
                />
                {errors?.textQuestions && errors?.textQuestions[index]?.answer && (
                  <span className="help-block">
                    {errors?.textQuestions[index]?.answer?.message}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default TextQuestions;
