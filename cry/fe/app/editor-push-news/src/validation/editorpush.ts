import { FieldValidator } from 'formik';
import { isEmpty, getStrLen } from "@/utils";
import { PushType } from "@/config/editorpush/push";

const Eng_Num_Regexp = /^([a-zA-Z0-9_\-]+,)*([a-zA-Z0-9_\-]+)$/; // 半角字符，半角逗号间隔

const Num_Regexp = /^([0-9]+,)*([0-9]+)$/; // 数字，半角逗号分隔

const Eng_Regexp = /^([a-zA-Z_\-],)+([a-zA-Z_\-]+)$/; // 英文，半角逗号分隔

const Chinaese_Regexp = /.*[\u4e00-\u9fa5]+.*$/ //中文

type Validater = (value: any, label?: string) => string | void;

// 校验是否为空
export const requiredValidate: Validater = (value, label = "该字段") => {
  if (isEmpty(value)) {
    return `${label}不能为空`;
  }
}

// 校验是否为半角字符+英文逗号
export const engnumWithSerpValidate: Validater = (value, label = "该字段") => {
  if (!value) {
    return;
  }
  if (Eng_Num_Regexp.test(value) === false) {
    return `${label}输入不合法`;
  }
}

// 校验数字 + 半角逗号
export const numWithSerpValidate: Validater = (value: any, label = "该字段") => {
  if (!value) {
    return;
  }
  if (Num_Regexp.test(value) === false) {
    return `${label}输入不合法`;
  }
}

// 校验英文 + 半角逗号, 无值不校验
export const engWithSerpValidate: Validater = (value, label = "该字段") => {
  if (!value) {
    return;
  }

  if (Eng_Regexp.test(value) === false) {
    return `${label}输入不合法`;
  }
}

// 用户uid校验
export const useridsValidate: FieldValidator = (value: string) => {
  if (isEmpty(value) === true) {
    return "用户userid不能为空";
  }

  if (Num_Regexp.test(value) === false) {
    return "用户userid中包含非法字段";
  }
}

// 标题校验 --暂时不限制长度
export const titleValidate = (value: string, cancelLimit: boolean = false) => {
  const length = getStrLen(value);
  if (isEmpty(value) || /^\s+/.test(value) || Chinaese_Regexp.test(value) === false) {
    return `标题不能为空或者以空格为开头,且必须包含文字`;
  }

  if (cancelLimit !== true && length > 18) {
    return `标题上限为18个字, 你已经输入了${length}个字`;
  }
}

// 摘要校验
export const summaryValidate = (value: string) => {
  const length = getStrLen(value);
  if (isEmpty(value) || /^\s+/.test(value)) {
    return `摘要不能为空或者以空格为开头`;
  }

  if (value.lastIndexOf('\n') === value.length - 1) {
    return '结尾不能为回车';
  }

  if (length > 62) {
    return `摘要超过62个字, 你已经输入了${length}个字`;
  }
}

// 推送分类校验
export const cateValidate = (value: string, pushtype: PushType) => {
  if (["auto", "auto_break"].includes(pushtype) == false || isEmpty(value) === false) {
    return;
  }

  return "推送分类不能为空";
}

// 推送圈选标签校验
export const tagsValidate = (value: string[]) => {
  if (isEmpty(value) === true) {
    return "推送圈选标签不能为空"
  }
}
