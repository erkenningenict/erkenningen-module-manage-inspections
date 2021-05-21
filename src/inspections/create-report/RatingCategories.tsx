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
// import CategoryRatingTotal from './CategoryRatingTotal';
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
  trigger: any;
  isReadOnly: boolean;
}> = ({ register, control, watch, getValues, setValue, errors, isReadOnly, trigger }) => {
  const { fields } = useFieldArray<{ ratings: VisitatieBeoordelingCategorieInput[] }>({
    control,
    name: 'ratings' as `ratings`,
  });
  return (
    <>
      {fields?.map((field, index) => (
        <div key={field.id}>
          <div className="sticky" style={{ backgroundColor: '#eee', marginBottom: 0 }}>
            <div className={`form-group`}>
              <label className="control-label col-sm-4 textRight" style={{ fontSize: '110%' }}>
                {field.CategorieNaam}
              </label>
              <div className="col-sm-3">
                <div className="form-control-static">
                  <strong>
                    <CategoryRating {...{ index, control }}></CategoryRating>
                  </strong>{' '}
                  (categorie totaal cijfer)
                </div>
              </div>
              {/* <div className="col-sm-1">
                <div className="form-control-static text-right">
                  <span className="visible-xs-inline">Weging: </span>
                  {field.Weging}
                </div>
              </div> */}
              <div className="col-sm-1 hidden-xs">
                <div className="form-control-static text-right">
                  {/* <CategoryRatingTotal
                    {...{ index, getValues, watch, setValue, control, trigger }}
                     weging={field.Weging}
                  ></CategoryRatingTotal> */}
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
            </div>
            <div
              className="form-group hidden-xs"
              style={{
                backgroundColor: '#eee',
              }}
            >
              <label className="control-label col-sm-4"></label>
              <div className="col-sm-1 form-control-static text-bold">Cijfer</div>
              <div className="col-sm-2 form-control-static text-bold">Cijfer (schuifregelaar)</div>

              {/* <div className="col-sm-1 form-control-static text-bold textRight">Weging</div>
              <div className="col-sm-1 form-control-static text-bold textRight">Totaal</div> */}
              <div className="col-sm-2 form-control-static text-bold">Toelichting</div>
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
