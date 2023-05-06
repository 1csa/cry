// 示例
// import { exportExcel } from '@/utils/exportExcel';
// const initalColumns = [
//   {
//       title: '日期',
//       dataIndex: 'date',
//       key: 'date',
//     },
//     {
//       title: '广告组',
//       dataIndex: 'ADgroup',
//       key: 'ADgroup',
//     },
//  ]
//  const initList = [
//     {
//       name: '张三',
//       age: 18,
//       address: 'address address address ...',
//     },
//     {
//       name: '李四',
//       age: 20,
//       address: '... address address address ...',
//     },
//   ];
//  exportExcel(initalColumns, initList, '统计表格.xlsx')

// 导出为csv格式的 量大不卡； 导出支持空数据， 支持空格
export const exportExcel = (initColumns: any, initList: any, name: string) => {
  let str: string = '';
  let arr: string[] = [];
  let keyArr: string[] = [];
  initColumns.forEach((item: any[]) => {
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
