// 把时间戳转化为 字符串的日期 
export const changeNumToDateString = (num: number):string => {
  const dateValue = new Date(num)
  let year = dateValue.getFullYear()
  let month = dateValue.getMonth() + 1
  let day = dateValue.getDate()
  let hour = dateValue.getHours()
  let minute = dateValue.getMinutes()
  let second = dateValue.getSeconds()
  let str = `${year}-${ month < 10 ? '0' + month : month }-${day < 10 ? '0' + day : day} ${hour}:${minute}:${second}`
  return str
};

export const changeNumToFullYear = (num: number):string => {
  const dateValue = new Date(num)
  let year = dateValue.getFullYear()
  let month = dateValue.getMonth() + 1
  let day = dateValue.getDate()
  let str = `${year}-${ month < 10 ? '0' + month : month }-${day < 10 ? '0' + day : day}`
  return str
};

// 把数字转 除 100  转换成 两位小数
export const changeNumToFloag = (num: number): string => {
  if (!num) {
    return '0'
  }
  let result:number = num / 100
  let str = result.toFixed(2)
  return str
};