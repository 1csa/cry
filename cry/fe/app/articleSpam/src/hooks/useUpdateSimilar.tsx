import React, { useState, useEffect } from 'react';
import Axios, {AxiosRequestConfig, Method} from 'axios';
import { UPDATE_SIMILAR_NEWS, UPDATE_CPP_NEWS, DELETE_CPP_NEWS, CPP_API_FROM, CPP_API_KEY, CPP_SCOPE, RECOVER_CPP_NEWS } from '@/config/constant';
import { message } from 'antd';


export function useUpdateSimilar(params: {[key: string]: any}, deps: any[] = []){
  const [loading, setLoading] = useState(false);
  const [updateDocs, setUpdate] = useState(false); // 更新列表
  useEffect(() => {
    if(params.docids){
      update();
    }
  }, deps);

  const updateCpp = async (params: any) => {
    // operation的值为空、为pass时不需要更新
    if(!params.operation){
      return {data: true};
    }
    let url = UPDATE_CPP_NEWS;
    let method: Method = "post";
    let scope = CPP_SCOPE[params.operation];
    let param = {
      from: CPP_API_FROM,
      key: CPP_API_KEY,
      docid: params.docids,
      batch: true
    };
    if(params.operation === 'remove'){
      url = DELETE_CPP_NEWS;
      method = "get";
    }else{ // 需要恢复文章
      await Axios({
        url: RECOVER_CPP_NEWS,
        method: "get",
        params:  param
      });
    }
    // // 对于 不服务 不推荐 不展示的文章 需要在 设置 scope 的同时 清除掉之前可能存在的 shenbian_high_quality 属性
    let axiosParams: AxiosRequestConfig = {
      method: method,
      url,
      params: param,
      data: {
        scope,
        shenbian_high_quality: false
      }
    };
    return await Axios(axiosParams);
  }
  const updateArticle = async () => {
    const {data} = await Axios.get(UPDATE_SIMILAR_NEWS, {
      params
    });
    if(data.code === 0 || data.status === 'success'){
      setUpdate(!updateDocs);
    }else{
      message.error(`审核失败, ${data.reason? '原因: '+ data.reason : ''}`);
    }
  }
  const update = async () => {
    setLoading(true);
    const result = await updateCpp(params);
    if(result.data) {
      await updateArticle();
    }else{
      message.error('更新cpp失败！');
    }
    setLoading(false);
  }
  return [loading, updateDocs];
}
