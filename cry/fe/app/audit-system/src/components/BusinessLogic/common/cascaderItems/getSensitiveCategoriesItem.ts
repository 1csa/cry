import { Dispatch } from '@/models/connect';

/**
 * 获取 敏感词分类
 */
export async function saveSensitiveCategoriesItem(
  dispatch: Dispatch,
  commonLogic: any,
): Promise<any> {
  const { category } = commonLogic;
  if (Object.keys(category).length && category?.code === 200) {
    return category?.data;
  } else {
    try {
      const { code, data } = await dispatch({ type: 'commonLogic/fetchCategory' });
      if (code === 200 && Array.isArray(data)) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
