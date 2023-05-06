import axios from 'axios';
import appConfig from '@/config/app.config';

export const getDeviceType = async () => {
  const res = await axios.get(`/api/proxy/${appConfig.API_HOST}/other/app`);
  return res
}

export const getStrategyType = async () => {
  const res = await axios.get(`/api/proxy/${appConfig.API_HOST}/other/risk_type`);
  return res
}

export const getSceneType = async () => {
  const res = await axios.get(`/api/proxy/${appConfig.API_HOST}/other/scene_type`);
  return res
}

export const getErrorCode = async () => {
  const res = await axios.get(`/api/proxy/${appConfig.API_HOST}/other/error_code`);
  return res
}

export const getFeatures = async () => {
  const res = await axios.get(`/api/proxy/${appConfig.API_HOST}/other/features`);
  return res
}

export const getSymbol = async () => {
  const res = await axios.get(`/api/proxy/${appConfig.API_HOST}/other/symbol`);
  return res
}

export const getActiveName = async () => {
  const res = await axios.get(`/api/proxy/${appConfig.API_HOST}/other/active_name`);
  return res
}
