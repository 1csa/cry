/**
 * csv 导出文件-历史列表导出（质检 | 默认）
 */
import request from 'umi-request';

import appConfig from '@/config/app.config';
import { formateTime, isJSON } from '@/utils/dev_helper';

import parseColumns from '@/components/BusinessLogic/tableColumnsParse';
import initFeaturesInfo from '@/components/BusinessLogic/getFeaturesInfo';
import { parseUserReviewResult, parseUserResultData } from '@/components/BusinessLogic/parseReshowData';
import { accountMap } from '@/components/Smart/MediaInfo/AuthorInfo';

import { parseClassificationTag, parseCategory } from '@/pages/commonPages/baseHisContentList/model/classification/tableColumns';
import { parseQualityLabels } from '@/pages/commonPages/baseHisContentList/model/quality/tableColumns';
import { parseQualityLabels as parseInspectionQualityLabels } from '@/pages/commonPages/baseHisContentList/model/inspection/tableColumns';

import { aging } from '@/data/articleQuality';
import { reviewStatus } from '@/data/constants';
import { exportCloumnsType } from '@/types/commonPage';

const SERVICEURL = `/api/proxy/${appConfig.MANUAL_AUDIT_URL}/audit/history/list`;
const pageSize = 250;
const maxReqCount = 40;
let percentArr: number[] = [];
// 导出 excel 头内容
const EXCEL = {
  // 默认
  default: [
    '标题',
    '简介',
    'docid',
    '分区',
    '入库时间',
    '审核时间',
    '审核人',
    '文章类型',
    // '文章属性',
    '举报类型',
    '时效性',
    '发布时间',
    '媒体ID',
    '媒体名称',
    '媒体类型',
    '媒体领域',
    '媒体等级',
    '命中关键词',
    '质量评分',
    '人工分类',
    '人工打标',
    '模型标记',
    '审核状态',
    '曝光量',
    '点击量',
    '点击率',
  ],
  // 质检
  inspection: [
    '内容ID',
    '分区',
    '标题',
    '审核时间',
    '入库时间',
    '发布时间',

    '时效性',
    '一审时效性',

    '审核状态',
    '一审审核状态',

    '质量分数',
    '一审质量分数',

    '质量标签',
    '一审质量标签',

    '是否与初审一致',

    '审核员',
    '被质检人',
  ],
};
// excel 模板分发
const getExcelTemplate = (contentType: string) => {
  const excelMap = {
    inspection: 'inspection',
    default: 'default',
  };
  const defaultValue = excelMap.default;
  return contentType ? excelMap[contentType] ?? defaultValue : defaultValue;
};

// excel 数据 Row
const getExcelRow = (row: any) => {
  const materialJson = isJSON(row?.material) ? JSON.parse(row.material) : {};
  const machineResultJson = isJSON(row?.machine_result) ? JSON.parse(row.machine_result) : {};
  const { title, summary, category, media, extraInfo, ctr, cntView, cntClick, attr ,feedback} = materialJson;
  const timeliness = aging.find(item => item.value === parseUserReviewResult(row)?.timeliness)?.label;
  
  const defaultRow = [
    formatString(title) || `""`,
    formatString(summary) || `""`,
    row?.docid || `""`,
    row?.part_zone_cn || `""`,
    formateTime(row?.time_receive) || `""`,
    formateTime(row?.tmmanul) || `""`,
    row?.auditor_id_l3 || row?.auditor_id_l2 || row?.auditor_id_l1 || `""`,
    formatString(category) || `""`,
    feedback?formatArray(feedback[0].fbcat): `""`,
    timeliness || `""`,
    attr?.time || `""`,
    media?.mediaId || `""`,
    formatString(media?.mediaName) || `""`,
    accountMap[media?.vest] || `""`,
    formatString(media?.mediaClass) || `""`,
    media?.mediaLevel || `""`,
    parseSens(machineResultJson) || `""`,
    parseUserReviewResult(row)?.score ?? `""`,
    parseCategory(row?.result_l3 || row?.result_l2 || row?.result_l1) || `""`,
    parseUserTag(row) || `""`,
    initFeaturesInfo(extraInfo?.features, machineResultJson?.leader?.words.length ? '封面图涉习' : '').join('、') || `""`,
    parseColumns.getAuditResult(row, row?.manual_status) || `""`,
    cntView || `""`,
    cntClick || `""`,
    ctr || `""`,
  ];

  const { sampledAuditName, materialBefore, last_same_sign } = materialJson;

  const materialBeforeObject = isJSON(materialBefore) ? JSON.parse(materialBefore) : {};
  const inspectionUserTagResult = parseInspectionUserTag(row);

  const inspectionRow = [
    row?.docid || `""`,
    row?.part_zone_cn || `""`,
    materialBeforeObject?.title || `""`,
    formateTime(row?.tmmanul) || `""`,
    formateTime(row?.time_receive) || `""`,
    formateTime(row?.releaseTime) || `""`,

    aging.find(item => item.value === parseUserResultData(row?.result_l1)?.timeliness)?.label ?? `""`,
    aging.find(item => item.value === parseUserResultData(row?.result_l2)?.timeliness)?.label ?? `""`,

    reviewStatus(inspectionUserTagResult?.result_l1.status) ?? `""`,
    reviewStatus(inspectionUserTagResult?.result_l2.status) ?? `""`,

    parseUserResultData(row?.result_l1)?.score ?? `""`,
    parseUserResultData(row?.result_l2)?.score ?? `""`,

    parseInspectionQualityLabels(inspectionUserTagResult?.result_l1) || `""`,
    parseInspectionQualityLabels(inspectionUserTagResult?.result_l2) || `""`,

    row?.last_same_sign ? `'是'` : `'否'`,

    row?.auditor_id_l3 || row?.auditor_id_l2 || row?.auditor_id_l1 || `""`,
    sampledAuditName || `""`,
  ];

  const ROW = {
    default: defaultRow,
    inspection: inspectionRow,
  };

  return ROW;
  // const newRow: string[] = ROW[excelTemplate] ?? ROW.default;
};

// 解析人审标签/结果
const parseUserTag = (row: any) => {
  const result = row?.result_l3 || row?.result_l2 || row?.result_l1;
  const r = isJSON(result) ? JSON.parse(result) : {};
  // 通过模版映射对应的人审标签
  switch (row?.template) {
    case 'ConcertPanel':
    case 'ExposurePanel':
      return r?.labels?.map((item: any) => item?.label).join('、');
    case 'FeedbackPanel':
      // return parseColumns.getManualResult(r?.status);
      return parseColumns.getManualResult(row);
    case 'QualityPanel':
      return parseQualityLabels(row || {});
    case 'CategoryMarkPanel':
      return parseClassificationTag(r);
    default:
      return '';
  }
};

// 质检历史人审标签
const parseInspectionUserTag = (row: any) => {
  const result1 = row?.result_l1;
  const result2 = row?.result_l2;
  const r1 = isJSON(result1) ? JSON.parse(result1) : {};
  const r2 = isJSON(result2) ? JSON.parse(result2) : {};
  // 质检结果 result_l1
  // 一审结果 result_l2
  return {
    result_l1: r1,
    result_l2: r2,
  };
};

/**
 * @param params 历史请求参数
 * @returns 历史接口返回的data数据
 */
function baseRequestData(params: any, index: number, pageNumber: number, callback: (p: number) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    return request(SERVICEURL, { params })
      .then(result => {
        const { desc, errorno, data } = result;
        if (errorno === 0) {
          // console.log('执行完了第', params?.pageNumber);
          percentArr[index] = index;
          const percentLen = percentArr.length - 1;
          const percent = Math.ceil((percentLen / pageNumber) * 100);
          // console.log('进度', percent, percentArr);
          callback && callback(percent);
          return resolve(data.data);
        } else {
          return reject(desc);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
}

/**
 * 数组的每一项都是一个 promise 具体的是 按照分页请求的接口的promise函数
 * @param params 请求参数
 * @returns 将每个请求组成数组 在后面调用promise.all
 */
function requestMapList(params: any, pageNumber: number, callback: (p: number) => void) {
  const requestMap = new Array(pageNumber)
    .fill('')
    .map((item, idx) => idx + 1)
    .map((pn, index) => {
      const opts = { ...params, pageSize, pageNumber: pn };
      // console.log('发起第' + pn + '个请求');
      return baseRequestData(opts, index + 1, pageNumber, callback);
    });
  return requestMap;
}

// 解析敏感词
function parseSens(mar: any) {
  try {
    const { context, title, subTitle, summary } = mar?.sensitive ?? {};
    return [
      ...new Set([...(context?.words || []), ...(title?.words || []), ...(subTitle?.words || []), ...(summary?.words || [])].map(item => item.word)),
    ].join('、');
  } catch (error) {
    console.log(error);
    return '';
  }
}

const formatString = (string: string = '') => `"${string.replace(/\"/g, '""')}"`;
const formatArray = (array:Array<[]>)=>array.join('\/')
// 创建下载
function createATagTodownload(blob: Blob, filename: string) {
  return new Promise((resolve, reject) => {
    const elink = document.createElement('a');
    elink.download = `${filename.replace(',', '-') || '文件导出'}.csv`;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 必须释放 URL 对象
    document.body.removeChild(elink);
  });
}

/**
 * 主体导出方法
 * @param total 当前查询数据的总条数
 * @param queryParams 查询参数
 * @param filename 文件名
 * @param contentType 导出模板分发标识， 质检 inspection | 默认
 * @returns
 */
export const exportCsv = (
  total: number,
  queryParams: any,
  filename: string,
  contentType: string,
  callback: (p: number) => void,
): Promise<boolean> => {
  // 导出 excel 模板
  const excelTemplate = getExcelTemplate(contentType);

  return new Promise((resolve, reject) => {
    if (!total) throw '无数据';

    const maxLen = Math.ceil(total / pageSize);

    // 分片 这里做了最大分片处理
    // 正常情况下的 分片请求都是可预知的，如果 你的promise.all 接受的数组
    // 是你无法预料的长度，一定是需要limit最大并发量的，不然可能会造成调用栈溢出
    const pageNumber = maxLen >= maxReqCount ? maxReqCount : maxLen;

    // 存储 CSV 数据 注意 csv的存储是以英文,分割的，所以集合类的数据不要用英文逗号分割最好转为、
    // 每一个,之前的数据在excel里打开就是一个单元格
    let cvsArray: string[] = [];

    const task = new Promise(async (resolve, reject) => {
      try {
        // 创建指定个数的随机数据
        const data = await Promise.all(requestMapList(queryParams, pageNumber, callback));
        // data是一个[[],[],[]]格式的数据，拍平一下处理
        // 格式化为 CSV 字符串
        // csv接受的格式是[0:'a,b,c', 1: 'a1,b1,c1', 2: 'a2,b2,c2']
        data?.flat(2)?.forEach((row, index) => {
          const ROW = getExcelRow(row);
          const newRow: string[] = ROW[excelTemplate] ?? ROW.default;
          // 将上一步数据存起来
          cvsArray[index] = newRow.join() + '\n';
        });

        // 创建表头 这里选择在最后再加表头是为了避免 percentArr 存数据的时候干扰
        cvsArray.unshift(EXCEL[excelTemplate].join() + '\n');

        // 适当暂停，避免页面无法执行渲染
        await new Promise(_resolve => {
          setTimeout(() => _resolve(true), 50);
        });

        resolve(true);
      } catch (error) {
        console.log('error 请求处理数据出错', error);
        reject(false);
      }
    });

    task
      .then(res => {
        if (res) {
          // 创建blob
          const blob = new Blob([String.fromCharCode(0xfeff), ...cvsArray], {
            type: 'text/plain;charset=utf-8',
          });

          createATagTodownload(blob, filename).catch(err => {
            console.log('err 创建a标签导出出错', err);
          });
          // 完成后将进度数据初始化
          percentArr = [];
          resolve(true);
        } else {
          reject(false);
        }
      })
      .catch(err => {
        console.log('err 创建blob里的某一个部分出错', err);
        reject(false);
      });
  });
};

/**
 * @description 增长里面的导出函数
 * @param initColumns 
 * @param initList 
 * @param name 
 */
export const exportToCsv = (initColumns: exportCloumnsType[], initList: Record<string, any>[], name: string) => {
  let str: string = '';
  let arr: string[] = [];
  let keyArr: string[] = [];
  initColumns.forEach((item: any) => {
    arr.push(item['title']);
    keyArr.push(item['key'] || item['dataIndex']);
  });
  str = arr.join(',') + '\n';
  for (let i = 0; i < initList.length; i++) {
    let subArr = keyArr.map((item) => {
      let temp = initList[i][item] === undefined ? '' : initList[i][item] + ''; // 转成字符串
      // 下面解决中文乱码问题 会把空格转成 #, 这里把空格转成 \xa0 就不会有这个问题了
      return temp ? temp.replaceAll(/\s+/g, '\xa0') : '';
    });
    let subStr = subArr.join('\t,');
    subStr += '\n';
    str += subStr;
  }
  // \ufeff 解决中文乱码问题
  var blob = new Blob(['\ufeff', str], { type: 'text/plain' });
  let object_url = window.URL.createObjectURL(blob);
  let link = document.createElement('a');
  link.href = object_url;
  link.download = `${name}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export const exportCommonCsvFile = (initColumns: any, initList: any, name: string) => {
  let str: string = '';
  let arr: string[] = [];
  let keyArr: string[] = [];
  initColumns.forEach((item: any) => {
    arr.push(item['title']);
    keyArr.push(item['key'] || item['dataIndex']);
  });
  str = arr.join(',') + '\n';
  for (let i = 0; i < initList.length; i++) {
    let subArr = keyArr.map((item) => {
      let temp = initList[i][item] === undefined ? '' : initList[i][item] + ''; // 转成字符串
      // 下面解决中文乱码问题 会把空格转成 #, 这里把空格转成 \xa0 就不会有这个问题了
      return temp ? temp.replaceAll(/\s+/g, '\xa0') : '';
    });
    let subStr = subArr.join('\t,');
    subStr += '\n';
    str += subStr;
  }
  // \ufeff 解决中文乱码问题
  var blob = new Blob(['\ufeff', str], { type: 'text/plain' });
  let object_url = window.URL.createObjectURL(blob);
  let link = document.createElement('a');
  link.href = object_url;
  link.download = `${name}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// export const exportExcelNew = <DT = Record<string, any>>(
//   headers: any,
//   data: DT[],
//   fileName: string = '表格.xlsx',
// ): void => {
//   const _headers: Record<string, CellObject> = headers
//     .map((item, i) =>
//       Object.assign(
//         {},
//         {
//           key: item.key || item.dataIndex,
//           title: item.title,
//           position: String.fromCharCode(65 + i) + 1,
//         },
//       ),
//     )
//     .reduce(
//       (prev, next) =>
//         Object.assign({}, prev, {
//           [next.position]: { key: next.key, v: next.title },
//         }),
//       {},
//     );

//   const _data: Record<string, CellObject> = data
//     .map((item, i) =>
//       headers.map((key, j) =>
//         Object.assign(
//           {},
//           {
//             content: item[key.key || key.dataIndex],
//             position: String.fromCharCode(65 + j) + (i + 2),
//           },
//         ),
//       ),
//     )
//     // 对刚才的结果进行降维处理（二维数组变成一维数组）
//     .reduce((prev, next) => prev.concat(next))
//     // 转换成 worksheet 需要的结构
//     // TODO: 需要修改数据转换格式，这里只是根据number类型做了临时的兼容
//     .reduce(
//       (prev, next) =>
//         Object.assign({}, prev, {
//           [next.position]: { v: next.content, t: typeof next.content === 'number' ? 'n' : undefined },
//         }),
//       {},
//     );

//   // 合并 headers 和 data
//   const output = Object.assign({}, _headers, _data);
//   // 获取所有单元格的位置
//   const outputPos = Object.keys(output);
//   // 计算出范围 ,["A1",..., "H2"]
//   const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

//   // 构建 workbook 对象
//   // TODO: 这里固定设置了前8个col的宽度，不太适用于通用util
//   const wb: WorkBook = {
//     SheetNames: ['mySheet'],
//     Sheets: {
//       mySheet: Object.assign({}, output, {
//         '!ref': ref,
//         '!cols': [
//           { wpx: 125 },
//           { wpx: 80 },
//           { wpx: 120 },
//           { wpx: 80 },
//           { wpx: 150 },
//           { wpx: 100 },
//           { wpx: 300 },
//           { wpx: 300 },
//         ],
//       }),
//     },
//   };

//   // 导出 Excel
//   XLSX.writeFile(wb, fileName, {
//     ignoreEC: true,
//   });
// };