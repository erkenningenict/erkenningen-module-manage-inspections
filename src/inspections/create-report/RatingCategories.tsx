import React from 'react';
import {
  UseFormRegister,
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
  errors: any;
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
  trigger: any;
  isReadOnly: boolean;
}> = ({ register, control, watch, getValues, setValue, errors, isReadOnly, trigger }) => {
  const { fields } = useFieldArray<{ ratings: VisitatieBeoordelingCategorieInput[] }>({
    control,
    name: 'ratings' as `ratings`,
  });
  return (
    <>
      <div className="form-group hidden-xs">
        <label className="control-label col-sm-4"></label>
        <div className="col-sm-1 form-control-static text-bold">Cijfer</div>
        <div className="col-sm-2 form-control-static text-bold">Cijfer (schuifregelaar)</div>
        <div className="col-sm-1 form-control-static text-bold">Weging | Punten</div>

        <div className="col-sm-2 form-control-static text-bold">Toelichting</div>
      </div>
      {fields?.map((field, index) => (
        <div
          key={field.id}
          style={{
            backgroundColor: index / 1 !== 1 ? '#eee' : 'transparent',
            paddingBottom: '15px',
            paddingTop: '15px',
          }}
        >
          <div
            className="sticky"
            style={{
              backgroundColor: index / 1 !== 1 ? '#eee' : '#fff',
            }}
          >
            <div className={`form-group`}>
              <label
                className="control-label col-sm-4 textRight"
                style={{ fontSize: '110%', textTransform: 'uppercase' }}
              >
                {(field as any).CategorieNaam}
              </label>
              <div className="col-sm-3" style={{ paddingRight: '5px' }}>
                <div className="form-control-static">
                  <strong>
                    <CategoryRating {...{ index, control }}></CategoryRating>
                  </strong>{' '}
                  (categorie cijfer)
                  <span className="hidden-sm hidden-md hidden-lg">
                    {' '}
                    weging: {(field as any).Weging} | punten:{' '}
                    <CategoryRatingTotal {...{ index, control }}></CategoryRatingTotal>
                  </span>
                </div>
              </div>
              <div className="col-xs-1 hidden-xs hidden-sm hidden-md hidden-lg">
                <div className="form-control-static text-right">
                  <input
                    {...register(`ratings.${index}.VisitatieBeoordelingCategorieID` as const)}
                    className="hidden"
                  />
                  <input
                    {...register(`ratings.${index}.VisitatieID` as const)}
                    className="hidden"
                  />
                  <input
                    {...register(`ratings.${index}.CategorieNaam` as const)}
                    className="hidden"
                  />
                  <input {...register(`ratings.${index}.Weging` as const)} className="hidden" />
                  <input
                    {...register(`ratings.${index}.TotaalPunten` as const)}
                    className="hidden"
                  />
                  <input {...register(`ratings.${index}.Cijfer` as const)} className="hidden" />
                  <input {...register(`ratings.${index}.Versie` as const)} className="hidden" />
                  <input {...register(`ratings.${index}.VanafDatum` as const)} className="hidden" />
                  <input
                    {...register(`ratings.${index}.CategorieTemplateID` as const)}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="col-xs-1 hidden-xs" style={{ paddingRight: '5px' }}>
                <div className="form-control-static">
                  {(field as any).Weging} |{' '}
                  <strong>
                    <CategoryRatingTotal {...{ index, control }}></CategoryRatingTotal>
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <RatingQuestion
            key={field.id}
            nestIndex={index}
            isReadOnly={isReadOnly}
            {...{ control, register, watch, getValues, setValue, errors, trigger }}
          ></RatingQuestion>
        </div>
      ))}
    </>
  );
};

export default RatingCategories;
