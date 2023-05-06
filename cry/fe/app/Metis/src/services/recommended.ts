import axios from 'axios';
import request  from '../utils/request'


// export const getRegistered= async (data:any) =>  await axios.post(`/api/proxy/${Environ}/type_register/register`, data)

// blender问题查询
export const getTaskBlender = async (params:any) =>  await request.get('http://www.qatool.yidian-inc.com:8089/jeecg-boot/tool/debug/blender', params)

// cb问题查询
export const getTaskCb = async (params:any) =>  await request.get('http://www.qatool.yidian-inc.com:8089/jeecg-boot/tool/debug/contentbase', params)

// user2news问题查询
export const getTaskUser= async (params:any) =>  await request.get('http://www.qatool.yidian-inc.com:8089/jeecg-boot/tool/debug/user2news', params)

// user2video问题查询
export const getTaskVideo= async (params:any) =>  await request.get('http://www.qatool.yidian-inc.com:8089/jeecg-boot/tool/debug/user2video', params)

// channelnews问题查询
export const getTaskChannel= async (params:any) =>  await request.get('http://www.qatool.yidian-inc.com:8089/jeecg-boot/tool/debug/channel2news', params)

// aio问题查询
export const getTaskAio= async (params:any) =>  await request.get('http://www.qatool.yidian-inc.com:8089/jeecg-boot/tool/debug/allinone', params)

// user2micro
export const getTaskMicro = async (params:any) =>  await request.get('http://www.qatool.yidian-inc.com:8089/jeecg-boot/tool/debug/user2micro', params)
