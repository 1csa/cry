import { Effect } from 'dva';
import { Reducer } from 'redux';

const TemplateModel: any = {
  namespace: 'template',
  state: {
    currentTemplate: ''
  },

  reducers: {
    setCurrentTemplate(state: any, action: any) {
      return {
        ...state,
        currentTemplate: action.payload.currentTemplate || '',
      };
    },
  },
};

export default TemplateModel;
