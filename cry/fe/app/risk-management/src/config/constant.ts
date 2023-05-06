export const FormItemLayout: Object = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};
export const TailFormItemLayout: Object = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 10,
    },
  },
};
export const defaultFeatureFormValue: Object = {
  "id": -1, //特征id
  "aliasName": "", //特征别名
  "calConditions": "", //限制条件
  "calFields": "", //字段名
  "calInterval": "", //计算频率
  "countUnit": "s", //计算单位
  "calMethod": "", //特征说明
  "featureCnName": "", //特征中文
  "featureEnName": "", //特征英文
  "level1Type": "", //特征类型1
  "level2Type": "", //特征类型2
  "rawTableName": "", //来源表
}
export const countUnitList: Array<any> = [
  {name: '秒', value: 's'},
  {name: '分', value: 'min'},
  {name: '小时', value: 'h'},
  {name: '天', value: 'd'},
]