import axios from 'axios';
import appConfig from '@/config/app.config';

export const getPoliciesList = async (obj) => {
  const res = await axios.post(`/api/proxy/${appConfig.API_HOST}/risk/policies/list`, obj);
  return res
}

export const getCumLative = async (obj) => {
  const res = await axios.post(`/api/proxy/${appConfig.API_HOST}/risk/activities/statistic/cumulative`, obj);
  return res
}

export const getUserData = async (obj) => {
  const res = await axios.post(`/api/proxy/${appConfig.API_HOST}/risk/activities/statistic/userData`, obj);
  return res
}

export const getCostData = async (obj) => {
  const res = await axios.post(`/api/proxy/${appConfig.API_HOST}/risk/activities/statistic/costData`, obj);
  return res
}

export const getTopData = async (obj) => {
  const res = await axios.post(`/api/proxy/${appConfig.API_HOST}/risk/activities/statistic/topData`, obj);
  return res
}

export const saveOrUpdate = async (obj) => {
  const res = await axios.post(`/api/proxy/${appConfig.API_HOST}/risk/policies/saveOrUpdate`, obj);
  return res
}
