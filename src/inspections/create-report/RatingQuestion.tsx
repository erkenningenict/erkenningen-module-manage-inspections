import React, { useEffect } from 'react';
import { useFieldArray, UseFormRegister, useWatch } from 'react-hook-form';
import {
  VisitatieBeoordelingCategorieInput,
  VisitatieBeoordelingCategorieVraagInput,
} from '../../generated/graphql';
import { IQuestionType } from '../../types/text-questions';
import TextareaAutosize from 'react-autosize-textarea';
import RatingTotal from './RatingTotal';
import CategoryRatingSlider from './CategoryRatingSlider';

const RatingQuestion: React.FC<{
  register: UseFormRegister<{
    textQuestions: IQuestionType[];
    ratings: VisitatieBeoordelingCategorieInput[];
  }>;
  //   register: any;
  //   errors: DeepMap<
  //     {
  //       textQuestions: IQuestionType[];
  //       ratings: VisitatieBeoordelingCategorieInput[];
  //     },
  //     FieldError
  //   >;
  //   fields: FieldArrayWithId<
  //     {
  //       vragen: VisitatieBeoordelingCategorieVraagInput[];
  //     },
  //     'vragen',
  //     'id'
  //   >[];
  nestIndex: number;
  control: any;
  getValues: any;
  setValue: any;
  errors: any;
  watch: any;
}> = ({ register, control, nestIndex, getValues, setValue, watch, errors }) => {
  // <{
  //     Vragen: VisitatieBeoordelingCategorieVraagInput[];
  //   }>
  const { fields: questions } = useFieldArray<{
    Vragen: VisitatieBeoordelingCategorieVraagInput[];
  }>({
    name: `ratings.${nestIndex}.Vragen` as 'ratings.0.Vragen',
    control,
    keyName: 'VisitatieBeoordelingCategorieVraagID',
  });
  // console.log('#DH# errors', errors);
  // const isBetween0and10 = (val: string): boolean => {
  //   return /^\d{1,1}$|^10$/.test(val);
  // };

  // const catQ = useWatch({ name: `ratings[${nestIndex}].Vragen`, control });
  // console.log('#DH# catQ', catQ);

  // const categoryQuestions: any[] = watch(`ratings.${nestIndex}.Vragen`);
  // useEffect(() => {
  //   const categoryTotal: number = categoryQuestions.reduce(
  //     (total: number, qA: VisitatieBeoordelingCategorieVraagInput, index: number) => {
  //       const totalQ = (qA.Cijfer || 0) * qA.Weging;
  //       setValue(
  //         `ratings.${nestIndex}.Vragen.${index}.TotaalPunten` as const,
  //         parseFloat(totalQ.toFixed(1)),
  //       );

  //       return total + (totalQ || 0);
  //     },
  //     0,
  //   );
  //   const category = getValues(`ratings.${nestIndex}`);
  //   // console.log('#DH# category Total', categoryTotal, category?.Weging);

  //   setValue(`ratings.${nestIndex}.TotaalPunten` as const, parseFloat(categoryTotal.toFixed(1)));
  //   setValue(
  //     `ratings.${nestIndex}.Cijfer` as const,
  //     parseFloat(((categoryTotal / category?.Weging) * 10).toFixed(2)) || 0,
  //   );
  // }, [categoryQuestions, nestIndex]);
  // }, [getValues(`ratings.${nestIndex}.Vragen`), 1]);
  // console.log('#DH# watcher', watcher);

  // useEffect(() => {
  //   register(`ratings.${nestIndex}.Vragen.${index}.Cijfer` as const);
  // }, [register]);

  const handleRatingChange = (rating: number, index: number) => {
    console.log('#DH# rating', rating);
    setValue(`ratings.${nestIndex}.Vragen.${index}.Cijfer` as const, rating);
  };

  return (
    <>
      {questions.map((field, index: number) => {
        let ratingError = false;
        if (
          errors &&
          errors?.ratings &&
          errors?.ratings[nestIndex] &&
          errors?.ratings[nestIndex]?.Vragen &&
          errors?.ratings[nestIndex]?.Vragen[index] &&
          errors?.ratings[nestIndex]?.Vragen[index]?.Cijfer
        ) {
          ratingError = true;
        }

        return (
          <div
            key={field.VisitatieBeoordelingCategorieVraagID}
            className={`form-group ${ratingError ? 'has-error' : ''}`}
          >
            <label className={`control-label col-sm-4 `}>{field.Naam}</label>
            <div className="col-sm-3" key={field.VisitatieBeoordelingCategorieVraagID}>
              <CategoryRatingSlider
                {...{ register, control, watch, getValues, nestIndex, index, setValue }}
              ></CategoryRatingSlider>
              <input
                key={field.VisitatieBeoordelingCategorieVraagID}
                type="number"
                className="form-control"
                {...register(`ratings.${nestIndex}.Vragen.${index}.Cijfer` as const, {
                  valueAsNumber: true,
                })}
                style={{ position: 'relative', zIndex: 0 }}
                min={0}
                max={10}
              ></input>
              {ratingError && (
                <span className="help-block">
                  {errors?.ratings[nestIndex]?.Vragen[index]?.Cijfer?.message}
                </span>
              )}
            </div>
            <div className="col-sm-1">
              <div className="form-control-static textRight">{field.Weging}</div>
            </div>
            <div className="col-sm-1 form-control-static textRight">
              <RatingTotal
                {...{ nestIndex, index, getValues, watch, setValue, control }}
                weging={parseInt(field.Weging, 10)}
              ></RatingTotal>
            </div>
            <div className="col-sm-3">
              <TextareaAutosize
                className="form-control"
                key={field.id}
                {...register(`ratings.${nestIndex}.Vragen.${index}.Toelichting` as const)}
                placeholder={`Toelichting ${field.Naam.toLowerCase()}`}
              ></TextareaAutosize>
              {errors &&
                errors?.ratings &&
                errors?.ratings[nestIndex] &&
                errors?.ratings[nestIndex]?.Vragen &&
                errors?.ratings[nestIndex]?.Vragen[index] &&
                errors?.ratings[nestIndex]?.Vragen[index]?.Toelichting?.message}

              <input
                {...register(
                  `ratings.${nestIndex}.Vragen.${index}.VisitatieBeoordelingCategorieVraagID` as const,
                )}
                className="hidden"
              />
              <input
                {...register(
                  `ratings.${nestIndex}.Vragen.${index}.VisitatieBeoordelingCategorieID` as const,
                )}
                className="hidden"
              />
              <input
                {...register(`ratings.${nestIndex}.Vragen.${index}.Naam` as const)}
                className="hidden"
              />
              <input
                {...register(`ratings.${nestIndex}.Vragen.${index}.Weging` as const)}
                className="hidden"
              />
              <input
                {...register(`ratings.${nestIndex}.Vragen.${index}.TotaalPunten` as const)}
                className="hidden"
              />
              <input
                {...register(`ratings.${nestIndex}.Vragen.${index}.Versie` as const)}
                className="hidden"
              />
              <input
                {...register(`ratings.${nestIndex}.Vragen.${index}.VanafDatum` as const)}
                className="hidden"
              />
              <input
                {...register(`ratings.${nestIndex}.Vragen.${index}.CategorieTemplateID` as const)}
                className="hidden"
              />
              <input
                {...register(`ratings.${nestIndex}.Vragen.${index}.VraagTemplateID` as const)}
                className="hidden"
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RatingQuestion;
