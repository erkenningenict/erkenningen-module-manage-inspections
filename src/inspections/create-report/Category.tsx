import React, { useEffect } from 'react';
import { FieldArray, FormikProps } from 'formik';
import RatingItem from './RatingItem';
import {
  VisitatieBeoordelingCategorie,
  VisitatieBeoordelingCategorieVraag,
} from '../../generated/graphql';

const Category: React.FC<{
  subform: FormikProps<any>;
  category: VisitatieBeoordelingCategorie;
  index: number;
}> = (props) => {
  let categoryTotal = 0;

  useEffect(() => {
    // console.log('#DH# category FX ', props.subform);
    categoryTotal = props.subform.values.ratings[props.index].Vragen?.reduce(
      (total: number, qA: VisitatieBeoordelingCategorieVraag) => {
        console.log('#DH# questionV', total, qA);
        return total + (qA?.TotaalPunten || 0);
      },
      0,
    );
    // console.log('#DH# cat total', categoryTotal);
    props.subform.setFieldValue(`ratings.${props.index}.TotaalPunten`, categoryTotal?.toFixed(1));
    // if (categoryTotal && props.subform.values.ratings[props.index].Weging) {
    props.subform.setFieldValue(
      `ratings.${props.index}.Cijfer`,
      ((categoryTotal / props.subform.values.ratings[props.index].Weging) * 10).toFixed(1),
    );
    // }
  }, [props.subform.values]);
  console.log('#DH# props', props.subform.values.ratings);
  return (
    <>
      <div className="form-group" style={{ backgroundColor: '#eee' }}>
        <label className="control-label col-sm-4 textRight">
          {props?.category?.CategorieNaam?.replace(/_/g, ' ')}
        </label>
        <div className="col-sm-1">
          <div className="form-control-static textRight">
            {props.subform.values.ratings[props.index].Weging}
          </div>
        </div>
        <div className="col-sm-1">
          <div className="form-control-static textRight">
            {props.subform.values.ratings[props.index].Cijfer}
          </div>
        </div>
        <div className="col-sm-1">
          <div className="form-control-static textRight">
            {props.subform.values.ratings[props.index].TotaalPunten}
          </div>
        </div>
      </div>
      <FieldArray name="Vragen">
        {() => (
          <div>
            {props.subform.values.ratings[props.index].Vragen?.map(
              (q: VisitatieBeoordelingCategorieVraag, qIndex: number) => (
                <RatingItem
                  key={qIndex}
                  question={q}
                  itemForm={props.subform}
                  categoryIndex={props.index}
                  questionIndex={qIndex}
                ></RatingItem>
              ),
            )}
          </div>
        )}
      </FieldArray>
    </>
  );
};

export default Category;
