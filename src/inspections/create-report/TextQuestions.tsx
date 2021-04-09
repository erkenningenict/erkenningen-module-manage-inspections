import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { UseFormRegister, DeepMap, FieldError, FieldArrayWithId } from 'react-hook-form';
import { VisitatieBeoordelingCategorieInput } from '../../generated/graphql';
import { IQuestionType } from '../../types/text-questions';

const TextQuestions: React.FC<{
  register: UseFormRegister<{
    textQuestions: IQuestionType[];
    ratings: VisitatieBeoordelingCategorieInput[];
  }>;
  errors: DeepMap<
    {
      textQuestions: IQuestionType[];
      ratings: VisitatieBeoordelingCategorieInput[];
    },
    FieldError
  >;
  fields: FieldArrayWithId<
    {
      textQuestions: IQuestionType[];
      ratings: VisitatieBeoordelingCategorieInput[];
    },
    'textQuestions',
    'id'
  >[];
}> = ({ register, errors, fields }) => {
  //   const {
  //     register,
  //     formState: { errors },
  //   } = useForm();
  //   const { fields } = useFieldArray({ name: 'textQuestions' });
  return (
    <>
      {fields?.map((field, index) => (
        <div
          className={`form-group ${
            errors?.textQuestions && errors?.textQuestions[index]?.answer ? 'has-error' : ''
          }`}
          key={field.id}
        >
          <label className="control-label col-sm-4">{field.question}</label>
          <div className="col-sm-8">
            <input
              {...register(`textQuestions.${index}.question` as `textQuestions.0.question`)}
              className="hidden"
            />
            <TextareaAutosize
              className="form-control"
              key={field.id}
              placeholder={`${field.question}`}
              {...register(`textQuestions.${index}.answer` as `textQuestions.0.answer`)}
            />
            {errors?.textQuestions && errors?.textQuestions[index]?.answer && (
              <span className="help-block">{errors?.textQuestions[index]?.answer?.message}</span>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default TextQuestions;
