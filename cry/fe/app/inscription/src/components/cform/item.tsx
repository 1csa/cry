import React, { CSSProperties } from 'react';
import CN from 'classnames';
import {
  Controller,
  Control,
  useFormContext,
  ValidationRule,
  ValidationValueMessage,
  Validate,
  FieldErrors,
} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { YIcon } from '@/components';

type ChildItem = React.ReactElement | null;

type ControllerRule = Partial<{
  required: string | boolean | ValidationValueMessage<boolean>;
  min: ValidationRule<React.ReactText>;
  max: ValidationRule<React.ReactText>;
  maxLength: ValidationRule<React.ReactText>;
  minLength: ValidationRule<React.ReactText>;
  pattern: ValidationRule<RegExp>;
  validate: Validate | Record<string, Validate>;
}>;

interface FormItem {
  label?: string;
  form?: boolean;
  name?: string;
  rule?: ControllerRule;

  className?: string;
  style?: CSSProperties;
  defaultValue?: any;
  children: ChildItem;
}

interface FormItemContent extends FormItem {
  control: Control;
  errors?: FieldErrors<any>;
}

const FormItemContent: React.FC<FormItemContent> = ({
  control, name, errors, children, label, rule, form, className, style, defaultValue,
}) => {
  return (
    <div className={CN('formitem', className)} style={style}>
      {label ? (
        <label className="formitem-label">
          {rule?.required ? <YIcon className="formitem-tip" type="alert" /> : null}
          <span>{label}</span>
        </label>
      ) : null}
      <div className="formitem-content">
        {form && name && children ? (
          <Controller
            name={name}
            rules={rule}
            control={control}
            defaultValue={defaultValue}
            render={({ value, onChange, onBlur }) => React.cloneElement(children, { value, onChange, onBlur })}
          />
        ) : (
          children
        )}
        {name ? (
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="formitem-message">
                <YIcon type="info-circle" />
                <span>{message}</span>
              </p>
            )}
          />
        ) : null}
      </div>
    </div>
  );
};

const FormItem: React.FC<FormItem> = props => {
  const form = useFormContext();
  const errors = form.errors;

  return <FormItemContent control={form.control} errors={errors} {...props} />;
};

export default React.memo(FormItem);
