import React from 'react';
import { useFieldArray, UseFormRegister } from 'react-hook-form';
import { VisitatieBeoordelingCategorieInput } from '../../generated/graphql';
import { IQuestionType } from '../../types/text-questions';
import TextareaAutosize from 'react-autosize-textarea';
import RatingTotal from './RatingTotal';
import CategoryRatingSlider from './CategoryRatingSlider';
import { Tooltip } from 'primereact/tooltip';

const RatingQuestion: React.FC<{
  register: UseFormRegister<{
    textQuestions: IQuestionType[];
    ratings: VisitatieBeoordelingCategorieInput[];
  }>;
  nestIndex: number;
  control: any;
  getValues: any;
  setValue: any;
  errors: any;
  watch: any;
  isReadOnly: boolean;
  trigger: any;
}> = ({
  register,
  control,
  nestIndex,
  getValues,
  setValue,
  watch,
  errors,
  isReadOnly,
  trigger,
}) => {
  const { fields: questions } = useFieldArray({
    name: `ratings.${nestIndex}.Vragen` as 'ratings.0.Vragen',
    control,
    keyName: 'VisitatieBeoordelingCategorieVraagID',
  });

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

        let questionRelevantForAfwijkendVanAanbod = false;
        switch ((field as any).Naam) {
          case 'Doelstelling behaald':
          case 'Voorgenomen inhoud behandeld, event. incl thuisopdracht':
          case 'Werkwijze als gepland toegepast':
            questionRelevantForAfwijkendVanAanbod = true;
            break;
        }

        return (
          <div
            key={field.VisitatieBeoordelingCategorieVraagID}
            className={`form-group ${ratingError ? 'has-error' : ''}`}
          >
            <label className={`control-label col-sm-4 `}>
              {(field as any).Naam}{' '}
              {questionRelevantForAfwijkendVanAanbod ? (
                <>
                  <Tooltip target=".notToIntention" position={'top'} />
                  <i
                    className="fas fa-exclamation-circle notToIntention"
                    style={{ color: 'yellow', background: '#333', borderRadius: '8px' }}
                    data-pr-tooltip="Cijfer telt mee voor berekening, afwijkend van aanbod (< 28 punten)."
                  ></i>
                </>
              ) : (
                ''
              )}
            </label>
            <div
              className="col-sm-1 no-padding-right-sm"
              key={field.VisitatieBeoordelingCategorieVraagID}
            >
              <input
                key={field.VisitatieBeoordelingCategorieVraagID}
                type="number"
                className="form-control"
                style={{ padding: '6px 2px 6px 12px' }}
                {...register(`ratings.${nestIndex}.Vragen.${index}.Cijfer` as const, {
                  valueAsNumber: true,
                })}
                defaultValue={watch(`ratings.${nestIndex}.Vragen.${index}.Cijfer`)}
                min={0}
                max={10}
                readOnly={isReadOnly}
              ></input>
              {ratingError && (
                <span className="help-block">
                  {errors?.ratings[nestIndex]?.Vragen[index]?.Cijfer?.message}
                </span>
              )}
            </div>

            <div className="col-sm-2">
              <div className="visible-xs-block" style={{ height: '15px' }}></div>
              <CategoryRatingSlider
                {...{ register, control, watch, getValues, nestIndex, index, setValue, trigger }}
                isReadOnly={isReadOnly}
              ></CategoryRatingSlider>
            </div>

            <div className="col-sm-1 hidden-xs form-control-static" style={{ paddingRight: '5px' }}>
              {(field as any).Weging} |{' '}
              <strong>
                <RatingTotal
                  {...{ nestIndex, index, getValues, watch, setValue, control }}
                  weging={parseInt((field as any).Weging, 10)}
                ></RatingTotal>
              </strong>
            </div>
            <div
              className="col-sm-1 hidden-sm hidden-md hidden-lg form-control-static"
              style={{ paddingRight: '5px' }}
            >
              Weging: {(field as any).Weging} / punten:{' '}
              <strong>
                <RatingTotal
                  {...{ nestIndex, index, getValues, watch, setValue, control }}
                  weging={parseInt((field as any).Weging, 10)}
                ></RatingTotal>
              </strong>
            </div>
            <div className="col-sm-4">
              <div className="visible-xs-block" style={{ height: '15px' }}></div>
              {isReadOnly && (
                <div className="form-control-static">{(field as any).Toelichting}</div>
              )}
              {!isReadOnly && (
                <>
                  <TextareaAutosize
                    className="form-control"
                    key={(field as any).id}
                    readOnly={isReadOnly}
                    {...register(`ratings.${nestIndex}.Vragen.${index}.Toelichting` as const)}
                    placeholder={`Toelichting ${(field as any).Naam.toLowerCase()}`}
                  ></TextareaAutosize>
                  {errors &&
                    errors?.ratings &&
                    errors?.ratings[nestIndex] &&
                    errors?.ratings[nestIndex]?.Vragen &&
                    errors?.ratings[nestIndex]?.Vragen[index] &&
                    errors?.ratings[nestIndex]?.Vragen[index]?.Toelichting?.message}
                </>
              )}
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
