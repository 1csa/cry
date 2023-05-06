import { message } from 'antd';
import { ApiResponseProps } from '@/types';

// 统一请求处理 error
const requestAsyncRes = async (fetchAPI: () => Promise<ApiResponseProps>): Promise<ApiResponseProps> => {
  try {
    const response: any = await fetchAPI();
    const { errorno, desc } = response;
    const { error, message: msg, status } = response;
    if (errorno !== 0) {
      const errorMsg = desc || errorno ? `errorno: ${errorno}` : `status: ${status || ''}, message: ${msg || ''}, error: ${error || ''}`;
      message.error(errorMsg);
    }
    return response;
  } catch (error) {
    message.error(error ? JSON.stringify(error) : '错误！');
    return {
      errorno: -1,
      desc: '错误！',
      data: 0,
    };
  }
};

export default requestAsyncRes;
