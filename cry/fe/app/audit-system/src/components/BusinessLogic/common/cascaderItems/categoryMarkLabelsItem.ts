import { Dispatch, ICategoryMarkingState } from '@/models/connect';
import { MainLabel } from '@/models/categoryMarking';

/**
 * 获取 打标大类
 */
export async function fetchMainCategoryMarkLabels(
  dispatch: Dispatch,
  categoryMarking: ICategoryMarkingState,
): Promise<MainLabel[]> {
  if (categoryMarking?.allCategoryList?.length) {
    return categoryMarking?.allCategoryList;
  } else {
    try {
      const data = await dispatch({
        type: 'categoryMarking/fetchAllCategoryList',
      });
      return data;
    } catch (error) {
      console.log('error', error);
      return [];
    }
  }
}

/**
 * 获取 打标二级
 */
export async function fetchSubcategory(
  dispatch: Dispatch,
  categoryMarking: ICategoryMarkingState,
  code: string,
): Promise<MainLabel[]> {
  if (categoryMarking?.subcategoryMap && categoryMarking?.subcategoryMap[code]) {
    return categoryMarking?.subcategoryMap[code];
  } else {
    try {
      const data = await dispatch({
        type: 'categoryMarking/fetchSubcategoryList',
        payload: {
          code,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

/**
 * 获取年华 打标数据
 */
export async function fetchNianHuaCategoryMarkLabels(
  dispatch: Dispatch,
  categoryMarking: ICategoryMarkingState,
): Promise<Omit<MainLabel, 'level'>[]> {
  if (categoryMarking?.nianHuaCategoryList?.length) {
    return categoryMarking?.nianHuaCategoryList;
  } else {
    try {
      const data = await dispatch({
        type: 'categoryMarking/fetchNianHuaCategoryList',
      });
      return data;
    } catch (error) {
      console.log('error', error);
      return [];
    }
  }
}
