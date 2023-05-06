import { useState, useCallback } from 'react';
import { message } from 'antd';

import { BaseUrl, commonRequest } from '@/utils/request';
import { RequestReturn } from '@/config/app.d';

// Todo: 想一下请求的封装要怎么封比较合适，现在这个过于死板且无意义

// 用于数据的获取
export const usePost =<T=undefined>(url: string)=> {
  const [ data, setData ] = useState<T>(); // 这里强制要求一个初始值，本来应该是可选参数，但是好像不能手动设置为undefined
  const [ fetchLoading, setFetchLoading ] = useState(false);

  const fetchData = useCallback( async ( param?: {[key: string]: any}, onSuccess?: Function )=>{
    setFetchLoading(true);

    try {
      let fetchUrl = BaseUrl + url;
      let response = await commonRequest.post<RequestReturn<T>>(fetchUrl, { data: param} )
      if (response.status === 'success' ) {
        setData(response.data);
        onSuccess && onSuccess();
      } else {
        message.error(response.data);
      }
    } catch (err) {
      message.error(JSON.stringify(err));
    } finally {
      setFetchLoading(false);
    }
  }, [url]);

  return { loading: { fetchLoading}, data, fetchData, }
};

// 用于数据的更新和删除等无回复请求
export const useUpdate =<U extends {[key: string]: any}>( url: string )=> {
  const [ updateLoading, setUpdateLoading ] = useState(false);

  const updateData = useCallback( async( param?: U, onSuccess?: Function)=>{
    setUpdateLoading(true);

    try {
      let updateUrl = BaseUrl + url;
      let response = await commonRequest.post<RequestReturn>(updateUrl, { data: param});
      if (response.status === 'success') {
        message.success('修改成功');
        onSuccess && onSuccess();
      }else {
        throw new Error(response.data);
      }
    } catch (err) {
      message.error(JSON.stringify(err));
    } finally {
      setUpdateLoading(false);
    }
  }, [url])

  return { updateLoading, updateData }
};

export const usePostAllData =async <T=undefined> (url: string,param?: {[key: string]: any})=> {
      let fetchUrl = BaseUrl + url;
      let response = await commonRequest.post<RequestReturn<T>>(fetchUrl, { data: param} )
      if (response.status === 'success' ) {
         return response.data
      } else {
        message.error(response.data);
      }

};