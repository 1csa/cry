import { useEffect } from 'react';
import { commonRequest, BaseUrl } from '@/utils/request';
import { usePost } from './common';
import { TeamsDataType, CitiesDataType } from '@/config/other.d';

export const queryAllTeams = async ()=> {
  // 这里不支持hooks形式的请求，hooks只能用在函数体或者组件当中，不支持call形式的访问？可以再看看这边的详细解释
  return commonRequest(`${BaseUrl}/other/teams`);

}

export const queryAllCities =()=> {
  return commonRequest(`${BaseUrl}/other/citys`);
  // const { data: allCities, fetchData: fetchAllCities } = usePost<CitiesDataType[]>('/other/citys') // 瞎猜的

  // useEffect(()=>{
  //   fetchAllCities();
  // },[]);

  // return allCities||[];
}

export const queryAllPusers =()=> {
  return commonRequest(`${BaseUrl}/other/pushMans`);
}
