import React from 'react';
import {
  UseFormRegister,
  DeepMap,
  FieldError,
  FieldArrayWithId,
  useFieldArray,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { VisitatieBeoordelingCategorieInput } from '../../generated/graphql';
import { IQuestionType } from '../../types/text-questions';
import CategoryRating from './CategoryRating';
import CategoryRatingTotal from './CategoryRatingTotal';
import RatingQuestion from './RatingQuestion';

const RatingCategories: React.FC<{
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
  setValue: UseFormSetValue<{
    textQuestions: IQuestionType[];
    ratings: VisitatieBeoordelingCategorieInput[];
  }>;
  getValues: UseFormGetValues<{
    textQuestions: IQuestionType[];
    ratings: VisitatieBeoordelingCategorieInput[];
  }>;
  control: any;
  fields: FieldArrayWithId<
    {
      textQuestions: IQuestionType[];
      ratings: VisitatieBeoordelingCategorieInput[];
    },
    'ratings',
    'id'
  >[];
  watch: any;
}> = ({ register, control, watch, getValues, setValue, errors }) => {
  const { fields } = useFieldArray<{ ratings: VisitatieBeoordelingCategorieInput[] }>({
    control,
    name: 'ratings' as `ratings`,
  });
  return (
    <>
      {fields?.map((field, index) => (
        <div key={field.id}>
          <div style={{ backgroundColor: '#eee' }} className={`form-group }`}>
            <label className="control-label col-sm-4 textRight">{field.CategorieNaam}</label>
            <div className="col-sm-3">
              <div className="form-control-static">
                <CategoryRating {...{ index, control }}></CategoryRating>
              </div>
            </div>
            <div className="col-sm-1">
              <div className="form-control-static textRight">{field.Weging}</div>
            </div>
            <div className="col-sm-1">
              <div className="form-control-static textRight">
                <CategoryRatingTotal
                  {...{ index, getValues, watch, setValue, control }}
                  weging={field.Weging}
                ></CategoryRatingTotal>
                <input
                  {...register(`ratings.${index}.VisitatieBeoordelingCategorieID` as const)}
                  className="hidden"
                />
                <input {...register(`ratings.${index}.VisitatieID` as const)} className="hidden" />
                <input
                  {...register(`ratings.${index}.CategorieNaam` as const)}
                  className="hidden"
                />
                <input {...register(`ratings.${index}.Weging` as const)} className="hidden" />
                <input {...register(`ratings.${index}.TotaalPunten` as const)} className="hidden" />
                <input {...register(`ratings.${index}.Cijfer` as const)} className="hidden" />
                <input {...register(`ratings.${index}.Versie` as const)} className="hidden" />
                <input {...register(`ratings.${index}.VanafDatum` as const)} className="hidden" />
                <input
                  {...register(`ratings.${index}.CategorieTemplateID` as const)}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <RatingQuestion
            key={field.id}
            nestIndex={index}
            {...{ control, register, watch, getValues, setValue, errors }}
          ></RatingQuestion>
        </div>
      ))}
    </>
  );
};

export default RatingCategories;