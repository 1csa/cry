import moment, { Moment } from 'moment'

// 格式化数字
const formatNumberRgx = (num: any) => {
  if(num === null || num === undefined) return ''
  let parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

// 格式化日期 年月日时分秒
const transferDate = (date: number | string) => {
  return !date ? '-' : moment(date).format('YYYY-MM-DD HH:mm:ss')
}
// 格式化日期 年月日
const transferDateYearMonthDay = (date: number | string) => {
  return !date ? '-' : moment(date).format('YYYY-MM-DD')
}

// 格式化时间
const tranferDateTime = (date: Moment, isEnd: boolean) => {
  const time = isEnd ? '23:59:59' : '00:00:00'
  const day = date.format('YYYY-MM-DD')
  return +moment(`${day} ${time}`)
}

// 读取指定 cookie
const getCookieByName = (name: string): string | null => {
  let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"))
  if (arr !== null) return unescape(arr[2])
  return null
}


/**
 * @param {Array} actual
 * @returns {Array}
 */
 const cleanArray = (actual:string[]): Array<string> => {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * 将json转为url参数
 * @param {Object} json
 * @returns {Array}
 */
const JSONtoParmas = (json: {}): string => {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
};

// 数组排除函数，排除 initArr 数组中的 exArr
const arrExcludeFn: (a: string[], b: string []) => string[] = (initArr: string [], exArr: string[]) => {
  let result: string[] = []
  if (initArr.length && exArr.length) {
    initArr.forEach(item => {
      if (!exArr.includes(item)) {
        result.push(item)
      }
    })
  }
  return result
}
export {
  formatNumberRgx,
  transferDate,
  tranferDateTime,
  getCookieByName,
  JSONtoParmas,
  arrExcludeFn,
  transferDateYearMonthDay,
}
