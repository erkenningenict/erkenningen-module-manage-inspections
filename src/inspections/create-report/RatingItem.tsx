import React, { useEffect } from 'react';
import { Field, FormikProps } from 'formik';
import { IRatingQuestion } from './CreateReport';
import { FormText } from '@erkenningen/ui/components/form';

const RatingItem: React.FC<{
  itemForm: FormikProps<any>;
  categoryIndex: number;
  questionIndex: number;
  question: IRatingQuestion;
}> = (props) => {
  // console.log('#DH# props rating item', props);
  useEffect(() => {
    // console.log('#DH# ratingItem FX ', props.itemForm);

    const total =
      (props.itemForm.values.ratings[props.categoryIndex].questions[props.questionIndex].rating *
        props.itemForm.values.ratings[props.categoryIndex].questions[props.questionIndex]
          .weighing) /
        10 || 0;
    props.itemForm.setFieldValue(
      `ratings.${props.categoryIndex}.questions.${props.questionIndex}.total`,
      total,
    );
  }, [props.itemForm.values]);
  return (
    <>
      <div className="form-group">
        <label className="control-label col-sm-4">{props.question.name.replace(/_/g, ' ')}</label>
        <div className="col-sm-1">
          <div className="form-control-static textRight">{props.question.weighing}</div>
        </div>
        <div style={{ padding: 0, width: '8.3%', float: 'left' }}>
          <Field
            component="input"
            type="number"
            className="form-control textRight"
            name={`ratings.${props.categoryIndex}.questions.${props.questionIndex}.rating`}
            onChange={props.itemForm.handleChange}
            min={0}
            max={10}
            pattern={/\d{1,2}/}
          ></Field>
          {/* {props.itemForm?.errors && (
            <span className="help-block">
              {
                props.itemForm?.errors?.cijfermatigeBeoordeling
                  ?.v1_1_Beginsituatie_deelnemers_nagegaan_WAARDERING
              }
            </span>
          )} */}
        </div>
        <div className="col-sm-1 form-control-static textRight">
          {props.itemForm.values.ratings[props.categoryIndex].questions[props.questionIndex].total}
          {/* {props.itemForm.values.ratings[props.categoryIndex].questions[props.questionIndex]
            .rating *
            props.itemForm.values.ratings[props.categoryIndex].questions[props.questionIndex]
              .weighing || 0} */}
          {/* {props.itemForm.v1_1_Beginsituatie_deelnemers_nagegaan_WEGING *
            props.itemForm.v1_1_Beginsituatie_deelnemers_nagegaan_WAARDERING} */}
        </div>
        <div className="col-sm-4">
          {/* <Field
            component="input"
            type="text"
            className="form-control"
            name={`ratings.${props.categoryIndex}.questions.${props.questionIndex}.remark`}
            onChange={props.itemForm.handleChange}
          ></Field> */}
          <FormText
            name={`ratings.${props.categoryIndex}.questions.${props.questionIndex}.remark`}
            label={''}
            labelClassNames={'col-sm-4'}
            formControlClassName="col-sm-12"
            isTextArea={true}
          />
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
