import React from 'react';

/**
 * form组件类型定义
 */
type FormLayout = 'horizontal' | 'inline' | 'vertical';

export type SelectOptionsType = {
    label: string;
    value: string | number;
    count?: number;
};

type Types = 'label' | 'value';
export type OnlyStringSelectOptionsType = Record<Types, string>;

interface fieldNames extends Omit<SelectOptionsType, 'count'> {
    children: string;
}
type FormItemRules = {
    required: boolean;
    message: string;
    min: number;
    max: number;
    pattern: RegExp;
    validator: (rule: any, value: string | number) => Promise<any>;
};

type FnOnChangeType = (
    value: number | string | boolean,
    fn?: (obj: Array<string | number | boolean> | { [k: string]: number | string | boolean }) => void,
) => void;
export type OnChangeFnType = Parameters<FnOnChangeType>;

type InputNumberType = {
    min: number;
    max: number;
    step: number | string;
    handleChange: (value: number | string | undefined) => void;
};

type ISwitchType = 'checkedChildren' | 'unCheckedChildren';

// 最基本的一些类型
export type BaseFormModelType = {
    label?: string; // 需要显示的labeL
    name?: string; // 与后端传递的key
    placeholder?: string;
    width?: number | string;
    type?: string; // 属于哪种组件类型
    disabled?: boolean;
    allowClear?: boolean;
    fieldNames?: fieldNames; // 级联需要重新命名的字段
    timeKey?: Array<string>; // 需要将时间数组转换为开始和结束时间戳的数组，包含的是需要给接口的字段，有这个字段的时候，name失效
    ddlCode?: number;
    renderComponent?: React.ReactNode; // React.createElement创建的业务组件
    formateTime?: string; // 日期组件需要格式化显示的str
    clearFields?: string[];
    loading?: boolean;
    protected?: boolean; // 受保护的字段，保护当前字段内容在onchange的时候不被清除
    isReplaceName?: boolean; // 为preSelect设置，是否需要删除原始label的name
    disabledDateStemp?: (current: moment.Moment) => boolean; // 通过回调函数的返回值 控制禁用时间组件时间段
    buttonName?: string;
    rules?: Arraytial<FormItemRules>>;
/**
 * 这里的value有点规则。isReplaceName
 * 如果是替换原始的name,preSelect中的vlaue就是给接口的字段名
 * 如果不是替换，则value的值是给接口的字段的key&value的拼接
 */
preSelect ?: Omit < fieldNames, 'children' > [];
format ?: string;
sourceData ?: Array<SelectOptionsType>;
inputNumber ?: Partial<InputNumberType>;
onChange ?: (value: OnChangeFnType[0], fn?: OnChangeFnType[1]) => void;
switchProps ?: Record<ISwitchType, string>;
mode ?: 'multiple' | 'tags';
};

// 整体表单
export interface IBasicForm {
    onSearch?: (value: { [K: string]: undefined | string | number }) => void;
    layout: FormLayout;
    formDataModel: Array<BaseFormModelType>;
    loading?: boolean;
    onValuesChange?: (changedValues: object, allValues: object) => void; // form value 变化监听
}

export interface Icategory {
    category: Array<Icategory> | null;
    categoryId: string;
    categoryName: string;
    categoryPid: string;
    createTime: number | string | null;
    enableStatus: number;
    operationUid: number | string | null;
}

export interface TaskFormItemTypes {
    material_type: number[];
    audit_level: number;
    business_unit_type?: number[];
    business_type?: number[];
}
