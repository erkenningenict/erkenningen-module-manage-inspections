import React, { useEffect, useMemo } from 'react';
import { FastField, Field, FormikProps } from 'formik';
import { FormText } from '@erkenningen/ui/components/form';
import { VisitatieBeoordelingCategorieVraagInput } from '../../generated/graphql';

const RatingItem: React.FC<{
  itemForm: FormikProps<any>;
  categoryIndex: number;
  questionIndex: number;
  question: VisitatieBeoordelingCategorieVraagInput;
}> = (props) => {
  // console.log('#DH# props rating item', props);
  useEffect(() => {
    // console.log('#DH# ratingItem FX ', props.itemForm);
    const total =
      (props.itemForm.values.ratings[props.categoryIndex].Vragen[props.questionIndex].Cijfer *
        props.itemForm.values.ratings[props.categoryIndex].Vragen[props.questionIndex].Weging) /
        10 || 0;

    // useMemo(() => {
    props.itemForm.setFieldValue(
      `ratings.${props.categoryIndex}.Vragen.${props.questionIndex}.TotaalPunten`,
      total,
    );
    // }, [props.itemForm.values]);
  }, [props.itemForm.values]);
  return (
    <>
      <div className="form-group">
        <label className="control-label col-sm-4">{props.question.Naam.replace(/_/g, ' ')}</label>
        <div className="col-sm-3">
          <FastField
            component="input"
            type="range"
            className="slider"
            tabIndex={-1}
            name={`ratings.${props.categoryIndex}.Vragen.${props.questionIndex}.Cijfer`}
            onChange={props.itemForm.handleChange}
            placeholder="Cijfer"
            style={{ position: 'absolute', zIndex: 1, left: '45px', width: 'calc(100% - 60px)' }}
            min={0}
            max={10}
          ></FastField>
          <FastField
            component="input"
            type="input"
            className="form-control"
            name={`ratings.${props.categoryIndex}.Vragen.${props.questionIndex}.Cijfer`}
            onChange={props.itemForm.handleChange}
            style={{ position: 'relative', zIndex: 0 }}
            placeholder="Cijfer"
            min={0}
            max={10}
            maxLength={2}
          ></FastField>
        </div>
        <div className="col-sm-1">
          <div className="form-control-static textRight">{props.question.Weging}</div>
        </div>
        <div className="col-sm-1 form-control-static textRight">
          {
            props.itemForm.values.ratings[props.categoryIndex].Vragen[props.questionIndex]
              .TotaalPunten
          }
          {/* {props.itemForm.values.ratings[props.categoryIndex].questions[props.questionIndex]
            .rating *
            props.itemForm.values.ratings[props.categoryIndex].questions[props.questionIndex]
              .weighing || 0} */}
          {/* {props.itemForm.v1_1_Beginsituatie_deelnemers_nagegaan_WEGING *
            props.itemForm.v1_1_Beginsituatie_deelnemers_nagegaan_WAARDERING} */}
        </div>
        <div className="col-sm-2">
          {/* <Field
            component="input"
            type="text"
            className="form-control"
            name={`ratings.${props.categoryIndex}.questions.${props.questionIndex}.remark`}
            onChange={props.itemForm.handleChange}
          ></Field> */}
          {/* <FormText
            name={`ratings.${props.categoryIndex}.Vragen.${props.questionIndex}.Toelichting`}
            label={''}
            labelClassNames={'col-sm-4'}
            formControlClassName="col-sm-12"
            placeholder={`Toelichting ${props.question.Naam.toLowerCase()
              .replace(/ /g, ' ')
              .replace(/_/g, ' ')}`}
            isTextArea={true}
          /> */}
          <FastField
            name={`ratings.${props.categoryIndex}.Vragen.${props.questionIndex}.Toelichting`}
            className="form-control"
            onChange={props.itemForm.handleChange}
            component="textarea"
            placeholder={`Toelichting ${props.question.Naam.toLowerCase()
              .replace(/ /g, ' ')
              .replace(/_/g, ' ')}`}
          ></FastField>
          {/* {props.itemForm?.errors && (
            <span className="help-block">
              {
                props.itemForm?.errors?.cijfermatigeBeoordeling
                  ?.v1_1_Beginsituatie_deelnemers_nagegaan_WAARDERING
              }
            </span>
          )} */}
        </div>
      </div>
    </>
  );
};

export default RatingItem;
