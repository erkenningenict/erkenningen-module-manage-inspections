import React from 'react';

export const FormStaticItem: React.FC<{
  label: string;
  labelClassNames?: string;
  fieldClassNames?: string;
}> = (props) => {
  return (
    <div {...props} className={'form-group'} style={{ marginBottom: '0' }}>
      <label className={`${props.labelClassNames || 'col-sm-4'} control-label`}>
        {props.label}
      </label>
      <div className={`${props.fieldClassNames || 'col-sm-8'} form-control-static`}>
        {props.children}
      </div>
    </div>
  );
};
