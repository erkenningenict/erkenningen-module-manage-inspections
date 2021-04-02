import React, { useEffect } from 'react';
import { FieldArray, FormikProps } from 'formik';
import RatingItem from './RatingItem';
import { ICategory } from './CreateReport';

const Category: React.FC<{ subform: FormikProps<any>; category: ICategory; index: number }> = (
  props,
) => {
  // console.log('#DH# props', props.category);
  // console.log('#DH# subform', props.subform);
  // const totalCategory = 0;
  // const numbers = props.subform.values.cijfermatigeBeoordeling;
  let categoryTotal = 0;
  const categoryRating = 0;

  useEffect(() => {
    // console.log('#DH# category FX ', props.subform);
    categoryTotal = props.subform.values.ratings[props.index].questions?.reduce(
      (total: number, qA: any) => {
        // console.log('#DH# questionV', total, qA.total);
        return total + qA.total;
      },
      0,
    );
    // console.log('#DH# cat total', categoryTotal);
    props.subform.setFieldValue(`ratings.${props.index}.total`, categoryTotal.toFixed(1));
    props.subform.setFieldValue(
      `ratings.${props.index}.rating`,
      ((categoryTotal / props.subform.values.ratings[props.index].weighing) * 10).toFixed(1),
    );
  }, [props.subform.values]);
  return (
    <>
      <div className="form-group">
        <label className="control-label col-sm-4 textRight">
          {props?.category?.categoryName?.replace(/_/g, ' ')}
        </label>
        <div className="col-sm-1">
          <div className="form-control-static textRight">
            {props.subform.values.ratings[props.index].weighing}
          </div>
        </div>
        <div className="col-sm-1">
          <div className="form-control-static textRight">
            {props.subform.values.ratings[props.index].rating}
          </div>
        </div>
        <div className="col-sm-1">
          <div className="form-control-static textRight">
            {props.subform.values.ratings[props.index].total}
          </div>
        </div>
      </div>
      <FieldArray name="questions">
        {() => (
          <div>
            {props.subform.values.ratings[props.index].questions?.map((q: any, qIndex: number) => (
              <RatingItem
                key={qIndex}
                question={q}
                itemForm={props.subform}
                categoryIndex={props.index}
                questionIndex={qIndex}
              ></RatingItem>
            ))}
          </div>
        )}
      </FieldArray>
    </>
  );
};

export default Category;
