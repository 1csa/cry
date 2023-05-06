// TODO 这个form有问题
// 最佳方案是：如果使用YForm来处理其中每个子项的附加逻辑，那么label、childs等所有内容项都应该同时决定，form组件自己只决定表单逻辑，这样不需要额外的定义组件

import React from 'react';
import cn from 'classnames';
import { Controller, Control } from 'react-hook-form';

import { FormItem } from '@/types/comp';
import { isUndefined } from '@/utils';

type FormItemElement = React.ReactElement<FormItem>;

type FormChildItem = React.ReactElement | null;

type YControllerRender = {
  value: any;
  name?: string;
  onBlur: () => void;
  onChange: (...events: any[]) => void;
};

interface YForm {
  label?: string;
  control: Control;
  children: FormChildItem | Array<FormChildItem>;
}

function YForm({ label, children, control }: YForm): React.ReactElement {
  const renderControllerItem = (formItem: FormItemElement, renderProps?: YControllerRender) => {
    const { name, className, defaultValue, ...formProps } = formItem.props;
    return React.cloneElement(formItem, {
      className: cn('formitem-content', className),
      ...renderProps,
      ...formProps,
    });
  };

  // 声明时不包含ReactText类型作为child
  const renderFormItem = (formItem: FormItemElement | null) => {
    if (!formItem || !formItem.props.type) {
      return formItem;
    }

    const name = formItem.props.name;
    const label = formItem.props.label;
    const visible = formItem.props.visible;
    const defaultValue = formItem.props.defaultValue;

    return (
      <div className="formitem" key={name || label} style={{ display: visible === false ? 'none' : 'flex' }}>
        {!isUndefined(label) && <label className="formitem-label">{label}</label>}
        {name ? (
          <Controller
            name={name}
            control={control}
            as={prop => renderControllerItem(formItem, prop)}
            defaultValue={defaultValue}
          />
        ) : (
          renderControllerItem(formItem)
        )}
      </div>
    );
  };

  const renderFormChildren = (children: FormChildItem | Array<FormChildItem>) => {
    return Array.isArray(children) ? children.map(formItem => renderFormItem(formItem)) : renderFormItem(children);
  };

  if (label) {
    return (
      <div className="formitem">
        <label className="formitem-label">{label}</label>
        <div className="formitem-flex">{renderFormChildren(children)}</div>
      </div>
    );
  }

  return <>{renderFormChildren(children)}</>;
}

export default React.memo(YForm);
