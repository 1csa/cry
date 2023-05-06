import { CSSProperties, ReactText } from "react"
import { iconmap } from "@/components/icon";

export type IconType = keyof typeof iconmap;

export interface FormItemRenderProp<VT=any> {
  value?: VT;
  name?: string;
  onBlur?: () => void;
  onChange?: (...events: any[]) => void;
}

export interface FormItemProp<VT=any> {
  type?: "form";
  name?: string; // 实际的类型要比string范围更小一点
  label?: string;
  defaultValue?: VT; // 给到controller的默认值
  visible?: boolean; // 当前组件是否可见，为了保留form字段名但是表单不可见设置
}

// YForm: 声明为Form的child表单
export interface FormItem<VT = any> extends FormItemRenderProp<VT>, FormItemProp<VT> {
  className?: string;
  style?: CSSProperties
  children?: React.ReactChild
}

// YSelect: 下拉表单选项，一定包含string和ReactText类型的变量，并且可能包含其他类型的变量, 类型定义过于泛了
export type SelectOption = Record<string, any>;

// YRadio: 单选表单选项
export type RadioOption = Record<string, ReactText | boolean>



