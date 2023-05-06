import { reactive } from 'vue';

interface Props {
  [key: string]: any;
}

export default function useFormItemColumns(formData: any[]) {

  const model: Props = {}
  const rules: Props = {}

  if (formData.constructor === Array) {
    for (let index = 0; index < formData.length; index++) {
      const element = formData[index];
      if (element.group) {
        for (const key in element.group) {
          model[key] = element.group[key].initValue
          rules[key] = element.group[key].rules
        }
      }
    }
  }

  if (formData.constructor === Object) {
    for (const key in formData) {
      model[key] = formData[key].initValue
      rules[key] = formData[key].rules
    }
  }

  const modelRef = reactive(model);
  const rulesRef = reactive(rules);

  return {
    modelRef,
    rulesRef,
  }
}
