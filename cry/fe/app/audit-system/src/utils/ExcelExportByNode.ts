import appConfig from '@/config/app.config';
import request from 'umi-request';
import axios from 'axios';
export default function handleExcelExport(data: any) {
  const url = `/api/app/blizzard/downloadExcel/downloadExcel?serviceUrl=${appConfig.MANUAL_AUDIT_URL}/audit/history/list`;
  // axios({
  //   method: 'post',
  //   url,
  //   headers: {},
  //   data: data,
  //   responseType: 'blob',
  // }).then(response => {
  //   const { data } = response;
  //   const blob = new Blob([data]);
  //   const elink = document.createElement('a');
  //   elink.download = 'fileName.xlsx';
  //   elink.style.display = 'none';
  //   elink.href = URL.createObjectURL(blob);
  //   document.body.appendChild(elink);
  //   elink.click();
  //   URL.revokeObjectURL(elink.href); // 释放URL 对象
  //   document.body.removeChild(elink);
  // });
  request(url, {
    method: 'POST',
    data: data,
    timeout: 300000,
    responseType: 'blob',
  })
    .then(response => {
      const blob = new Blob([response]);
      const elink = document.createElement('a');
      elink.download = 'fileName.xlsx';
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 必须释放 URL 对象
      document.body.removeChild(elink);
    })
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log('err', err);
    })
    .finally(() => {});
}
