import { Effect } from 'dva';
import { Reducer } from 'redux';
import {saveSlides, querySlides} from '@/services/slide';

export interface SlideModelState{
  loading: boolean;
  slides: SLIDE[];
}

export interface SlideModelType {
  namespace: 'slide';
  state: SlideModelState;
  effects: {
    fetchSlides: Effect,
    addSlides: Effect
  };
  reducers: {
    saveSlides: Reducer<SlideModelState>
  };
}

const SlideModel: SlideModelType = {
  namespace: 'slide',
  state: {
    loading: true,
    slides: []
  },
  effects: {
    *fetchSlides(_, {call, put}){
      // console.log('sssas');
      const response = yield querySlides();
      // console.log(response, 'aa');
      yield put({
        type: 'saveSlides',
        payload: {
          loading: false,
          slides: response
        }
      });
    },
    *addSlides({payload}, {call, put}){
      console.log(payload);
    }
  },
  reducers: {
    saveSlides(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
}

export default SlideModel
