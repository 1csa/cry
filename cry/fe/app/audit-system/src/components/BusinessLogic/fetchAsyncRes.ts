import { ApiResponseProps, PromiseDataType } from '@/types';

const fetchAsyncRes = async (cb: () => Promise<ApiResponseProps>): Promise<[null | unknown, PromiseDataType, {}]> => {
  try {
    const { errorno, data, desc } = await cb();
    if (errorno === 0) {
      if (typeof data === 'number' || Array.isArray(data) ) {
        return [null, 0, {}];
      } else {
        const { countAll, page, size } = data;
        return [
          null,
          data.data || [],
          {
            current: page,
            total: countAll,
            size,
          },
        ];
      }
    } else {
      return [desc || 'error，未知错误！', [], {}];
    }
  } catch (error) {
    return [error, [], {}];
  }
};

export default fetchAsyncRes;
