import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {GET_SIMILAR_NEWS} from '@/config/constant'
import { message } from 'antd';
export const useGetSimilar = (params: {[key: string]: any}, dep: any[]) => {
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);
  useEffect(()=> {
    const [docid, open] = dep;
    if(open && !!docid){
      getSimilar();
    }
  }, dep);
  const getSimilar = async () => {
    setLoading(true);
    const {data} = await Axios.get(GET_SIMILAR_NEWS, {
      params
    });
    if(data.code === 0 || data.status === 'success'){
      setDocs(data.result || []);
    }else{
      message.error(`数据请求失败, ${data.reason? '原因: '+ data.reason : ''}`);
    }
    setLoading(false);
  }
  return {loading, docs}
}
