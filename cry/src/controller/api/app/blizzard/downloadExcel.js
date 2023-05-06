const Base = require('../../../base');
const axios = require('axios');
const XLSX = require('xlsx');
const EXCEL_TITLE = [
  '标题',
  '简介',
  'docid',
  '分区',
  '入库时间',
  '审核时间',
  '审核人',
  '文章类型',
  '媒体ID',
  '媒体名称',
  '领域',
  '等级',
  '命中关键词',
  '人工打标',
  '模型标记',
  '审核状态'
]
const reviewStatus = {
  3001: '审核通过',
  3002: '审核不通过',
  3003: '审核部分通过',
  3004: '待审核',
  3005: '审核中',
  3010: '审核结束',
  3101: '机审通过',
  3102: '机审不通过',
  3103: '3103',
  3104: '部分通过',
  3105: '3105',
  3106: '通过后先发',
  3109: '未知',
  9999: '已作废',
}

module.exports = class extends Base {

  constructor(props) {
    super(props)
  }
  unique(arr) {
    return arr.reduce((pre, cur) => !pre.includes(cur) ? [...pre, ...[cur]] : pre, [])
  }
  flatten(arr) {
    return arr.reduce((pre, cur) => [...pre, ...(Array.isArray(cur) ? this.flatten(cur) : [cur])], [])
  }

  parseStatus(code) {
    return reviewStatus[code]
  }
  parseResult(res) {
    const ret = typeof res === 'string' ? JSON.parse(res) : {}
    return ret.labels && ret.labels.toString()
  }
  parseSens(machine_result) {
    const { sensitive } = machine_result
    const { context, title } = sensitive
    return this.unique([...context.words, ...title.words].map(item => item.word)).toString()
  }

  async baseAxiosRequest(serviceUrl, params) {
    return new Promise((resolve, reject) => {
      return axios.get(serviceUrl, {
        params
      }).then((result) => {
        const { desc, errorno, data } = result.data
        if (errorno === 0) {
          return resolve(data.data)
        } else {
          return reject(desc)
        }
      }).catch((err) => {
        return reject(err)
      })
    })
  }
  sheetToBuffer(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    let workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    let wopts = {
      bookType: 'xlsx', // 要生成的文件类型
      type: 'buffer'
    };
    let wbout = XLSX.write(workbook, wopts);
    return wbout;
  }
  mapList(serviceUrl, params) {
    const MAX_COUNT = 100000
    const pageSize = 250
    const pageNumber = 20
    let requestArr = []
    for (let i = 0; i < pageNumber; i++) {
      requestArr[i] = i + 1
    }
    // console.log('requestArr', requestArr);
    const att = requestArr.map(pageNumber => {
      const opts = { ...params, pageSize, pageNumber }
      console.log('发起第' + pageNumber + '个请求');
      return this.baseAxiosRequest(serviceUrl, opts)
    })
    // console.log('att', att);
    return att
  }

  async downloadExcelAction() {
    console.log('开始下载');
    const params = this.post()
    const serviceUrl = this.get('serviceUrl')
    const ret = await Promise.all(this.mapList(serviceUrl, params))

    const allData = this.flatten(ret)

    let xlsData = [EXCEL_TITLE];
    for (const element of allData) {
      const materialJson = typeof element.material === 'string' ? JSON.parse(element.material) : {}
      const { title, summary, category, media } = materialJson
      let d = [
        title,
        summary,
        element.docid,
        element.part_zone_cn,
        element.time_receive,
        element.tmmanul,
        element.auditor_id_l1 || element.auditor_id_l2 || element.auditor_id_l3,
        category,
        media.mediaId,
        media.mediaName,
        media.mediaClass,
        media.mediaLevel,
        this.parseSens(typeof element.machine_result === 'string' ? JSON.parse(element.machine_result) : {}),
        this.parseResult(element.result_l3 || element.result_l2 || element.result_l1),
        this.parseStatus(element.status_l3 || element.status_l2 || element.status_l1)
      ];
      xlsData.push(d);
    }
    // 生成表格
    let sheet = XLSX.utils.aoa_to_sheet(xlsData);
    const ctx = this.ctx
    //excel转node文件流
    const result = this.sheetToBuffer(sheet);
    const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    ctx.body = result;
    ctx.set("Content-Type", mimeType);
    ctx.status = 200;
  }
};
