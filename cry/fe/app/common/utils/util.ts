import XLSX from 'xlsx';
import Axios from 'axios';

const openDownloadDialog = (url: any, saveName: any) => {
  if (typeof url == 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) event = new MouseEvent('click');
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    );
  }
  aLink.dispatchEvent(event);
};
const sheet2blob = (sheet: any, sheetName: any) => {
  sheetName = sheetName || 'sheet1';
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {},
  };
  workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

  var wopts: any = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary',
  };
  var wbout = XLSX.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  }); // 字符串转ArrayBuffer
  function s2ab(s: any) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  return blob;
};

interface IDownLoadXlsx {
  filename: string;
  url?: string;
  params?: { [key: string]: any };
  sheetData?: Array<any>;
}
export const downLoadXlsx = async (param: IDownLoadXlsx) => {
  const { filename, url, params, sheetData } = param;
  if (sheetData && sheetData.length > 0) {
    const sheet = XLSX.utils.json_to_sheet(sheetData);
    openDownloadDialog(sheet2blob(sheet, undefined), `${filename}.xlsx`);
  } else {
    const {
      data: { code, result, status, errorno, data },
    } = await Axios.get(url, {
      params,
    });
    if (code === 0 || status === 'success' || errorno === 0) {
      const sheet = XLSX.utils.json_to_sheet(result || data?.data || []);
      openDownloadDialog(sheet2blob(sheet, undefined), `${filename}.xlsx`);
    } else {
      console.error(`下载失败, 稍后重试!`);
    }
  }
};
