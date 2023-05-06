import axios from 'axios';

let host = location.host;

let testUrl = 'http://10.136.130.25:7752'; // 增长的测试环境
let productionUrl = 'http://ug-platform-api.yidian-inc.com'; // 增长的正式环境
let homeUrl = host === 'zeus.v.yidian-inc.com' ? productionUrl : testUrl;

export const getControls = async (url: string) => {
  const res = await axios({
    method: "get",
    url: homeUrl + url,
  })
  return res
}
export const getReportData  = async (obj: any) => {
  const res = await axios({
    method: "post",
    url: homeUrl + '/ugp/report/data ',
    data: obj,
  })
  return res
}