import { downLoadXlsx } from '../../../common/utils/util';

export function exportData(filename:string,result:Array<object>,column:Array<object>) {
  const sheetData:Array<any> = [];
    result.map((item,index) => {
      sheetData[index] = {};
      column.map((k:any) => {
        const num = Object.keys(item).indexOf(k.key);
        if (num > -1) {
          if (typeof item[k.key] === 'object' && item[k.key]?.splitdata) {
            sheetData[index][k.title] = item[k.key].splitdata;
          } else if (typeof item[k.key] === 'object' && item[k.key]?.type && item[k.key]?.content) {
            sheetData[index][k.title] = `${item[k.key].type}: ${item[k.key].content}`;
          } else {
            sheetData[index][k.title] = item[k.key];
          }
        }
      })
    })
    downLoadXlsx({
      filename: filename,
      sheetData: sheetData,
    });
}

export function exportIdData(filename: string, result:string, column: string) {
  let sheetData:Array<any> = []
  column.split(',').map((item, index) => {
    sheetData[index] = {}
    sheetData[index][result + "(选中所有ID-『数据』-『分列』-『完成』)"] = item
  })
  downLoadXlsx({
    filename,
    sheetData
  })
}
