import { Formik, FormikConfig, FormikProps, isFunction } from 'formik';
import React from 'react';
import * as yup from 'yup';

const schemaDefaults = (schema: FormikSchema<any>): any => {
  const result: any = {};
  Object.keys(schema).forEach((key) => {
    result[key] = schema[key][0] === null ? undefined : schema[key][0];
  });
  return result;
};
const schemaValidations = (schema: FormikSchema<any>): any => {
  const result: any = {};
  Object.keys(schema).forEach((key) => {
    result[key] = schema[key][1];
  });
  return yup.object(result);
};

export type FormikSchema<T> = {
  [P in keyof T]: [T[P], any];
};

const Form: React.FC<
  {
    className?: string;
    schema?: FormikSchema<any>;
  } & Omit<FormikConfig<any>, 'initialValues'> & {
      initialValues?: any;
    }
> = (props) => {
  return (
    <Formik
      {...props}
      initialValues={props.schema ? schemaDefaults(props.schema) : props.initialValues}
      validationSchema={props.schema ? schemaValidations(props.schema) : props.validationSchema}
    >
      {(formikProps: FormikProps<any>) => (
        <form
          onReset={formikProps.handleReset}
          onSubmit={formikProps.handleSubmit}
          className={`form ${props.className || ''}`}
        >
          {isFunction(props.children) ? (props.children as any)(formikProps) : props.children}
        </form>
      )}
    </Formik>
  );
};

export default Form;
