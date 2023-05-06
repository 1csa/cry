export interface deviceTypeSubItem {
    cnValue: string
    id: number
    type?: string
    value: string
}

export interface FormProps {
    form: { getFieldDecorator: any; validateFieldsAndScroll: any; resetFields: any};
    deviceType: deviceTypeSubItem[],
    strategyType: deviceTypeSubItem[],
    sceneType: deviceTypeSubItem[],
    dispatch?: any,
    activeNameList?: any
}
// 搜索项
export interface searchValues {
    appId: string
    codeName: string
    policiesId: string
    riskType?: string
    sceneType?: string
    status: string
}

export interface itemData {
    appIds?: string,
    appNames?: string | string[],
    codeDescribe: string,
    codeExpression: string,
    codeName: string,
    createUser?: string,
    errorCode?: string,
    featuresArray: string[],
    id: string,
    proportion: number,
    riskType?: string,
    sceneType?: string,
    score: number,
    status: number,
    updateTime: number,
    updateUser?: string,
    expressionValue?: string
  }
