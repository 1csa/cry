import { ConnectState } from '@/models/connect';
import { arrExcludeFn } from '@/utils/utils';

export const editorauthSelector = ({ accountEnum }: ConnectState): string[] => {
  return accountEnum.accountEditorAuth.permission;
};

export const pushkeySelector = ({ accountEnum }: ConnectState) => {
  return accountEnum.accountEditorAuth.push_key;
};

export const toolauthSelector = ({ accountEnum }: ConnectState): number[] => {
  return accountEnum.accountToolAuth;
};

export const templistSelector = ({ accountEnum }: ConnectState) => {
  let result = accountEnum.templist.filter(item => {
    return accountEnum.accountEditorAuth.permission.includes(item.values.pushType as string) ||
      item.values.pushType === 'userids' ||
      item.values.pushType === 'appids';
  });
  let date = new Date()
  let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let dateStr = `${hour}:${min}`
  // console.log(dateStr)
  // 这里修改模板标签的默认选中值

  result.forEach(item => {
    if (item['temp_id'] === '001' || item['temp_id'] === '003') {
      item['values']['excludeTags'] = ['e2465900', 'e2465918', 'e2465915', 'e3144742']
    }
    //2月23号更改oppo标签的默认选中
    // const initArr = ['e2465900', 'e2465918', 'e2465906', 'e2465909', 'e2465919', 'e2465904', 'e2552446', 'e2465905', 'e3144742']
    const initArr = ['e2465900', 'e2465918', 'e2465906', 'e2465909', 'e2465919', 'e3144742']
    if (item['temp_id'] === '002') {
      if (dateStr >= '00:00' && dateStr < '11:00') {
        item['values']['excludeTags'] = arrExcludeFn(initArr, ['e2465906'])
      } else {
        item['values']['excludeTags'] = initArr
      }
      item['values']['inter_channel'] = []
      let subArr = item['forms']['user']
      if (!subArr.includes('inter_channel')) {
        let index = subArr.indexOf('extag')
        subArr.splice(index + 1, 0, 'inter_channel')
        item['forms']['user'] = [...subArr]
      }
    }
    if (item['temp_id'] === '002') { // 这个下面  有个推送交集 字段
      item['values']['inter_channel'] = []
      let subArr = item['forms']['user']
      if (!subArr.includes('inter_channel')) {
        let index = subArr.indexOf('extag')
        subArr.splice(index + 1, 0, 'inter_channel')
        item['forms']['user'] = [...subArr]
      }
    }
    if (item['temp_id'] === '002') {
      let subArr = item['forms']['user']
      let newArr: any[] = []
      subArr.forEach(subItem => {
        if (subItem !== 'userlayer' && subItem !== 'veins') {
          newArr.push(subItem)
        }
      })
      item['forms']['user'] = newArr
    }
    if (item['temp_id'] === '003') {
      let subArr = item['forms']['user']
      let newArr: any[] = []
      subArr.forEach(subItem => {
        if (subItem !== 'userlayer') {
          newArr.push(subItem)
        }
      })
      item['forms']['user'] = newArr
    }
  })
  return result
};

