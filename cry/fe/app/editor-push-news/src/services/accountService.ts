import request from '@/utils/request'
import appConfig from '@/config/app/app.config'

// 获取 account 枚举
export async function getAccountEnum(): Promise<any> {
  return request.get(`/api/editor_push/getAccountEnum`)
}

// 获取 editor list
export async function getEditorList(user_name: string = ''): Promise<any> {
  return request.get(`/api/push/common/permission?type=get-editor-list&status=active&user_name=${user_name}`)
}

// 新增
export async function createEditor(user_email: string, permission: Array<string>, switch_value: string): Promise<any> {
  return request.get(`/api/push/common/permission?type=create-editor&user_email=${user_email}&permission=${permission.join(',')}&switch_value=${switch_value}`)
}

// 更新
export async function updateEditor(user_email: string, permission: Array<string>, switch_value: string): Promise<any> {
  return request.get(`/api/push/common/permission?type=update-editor-info&user_email=${user_email}&permission=${permission.join(',')}&switch_value=${switch_value}`)
}

// 删除
export async function removeEditor(user_email: string, status: string = 'inactive'): Promise<any> {
  return request.get(`/api/push/common/permission?type=update-editor-info&user_email=${user_email}&status=${status}`)
}

// 获取账户的push权限
export async function getPushAuth() {
  return await request.get(`/api/push/common/pushauth`);
}

// 获取账户的工具权限
export async function getToolAuth() {
  return await request.get(`/api/push/common/toolauth`);
}

// 获取对应业务线中该账户下的所有模版名称
export async function getPushTemps(biz?: string) {
  return await request.get(`/api/push/common/temp`, { params: { biz } });
}

// 获取常用分类
export async function getCates() {
  return await request.get('/api/push/common/getcate');
}

// 获取常用标签
export async function getTags() {
  const originData = await request(`/api/push/common/gettag`);
  let resultKeys = Object.keys(originData['result'])
  let keyArrs: string [] = []
  resultKeys.forEach(item => {
    let subArr = Object.keys(originData['result'][item])
    if (subArr.length) {
      keyArrs = [...keyArrs, ...subArr]
    }
  })
  keyArrs = [...new Set(keyArrs)] // 去重
  if (keyArrs.length) {
     // 从接口拿数据 保证每次都是最新 真实的数据
    let useData =  await request.get('/api/push/editor/tagcount', { params: { fromid: keyArrs.join(',') } });
    useData = useData['result']
    resultKeys.forEach(item => {
      let subArr = Object.keys(originData['result'][item])
      if (subArr.length) {
        let subObj = originData['result'][item]
        Object.keys(subObj).forEach(key => {
          if (useData[key]) {
            let realNum = useData[key]
            let tempStr = subObj[key]
            let tempArr = tempStr.split('_')
            if (tempArr[tempArr.length - 1]) { // 比如 oppo中度沉默低活用户_不活跃编辑_18 前面可能有好几个下划线， 数字是最后一个
              tempArr[tempArr.length - 1] = realNum
            }
            subObj[key] = tempArr.join('_')
          }
        })
      }
    })
  }
  // console.log(originData)
  return originData
}

// 存储常用分类
export async function saveStoredCates(cates: string[] = []) {
  return await request.post('/api/push/common/postcate', { data: { cates } });
}

// 存储常用标签
export async function saveStoredTags(tags: Record<string, string>, extags: Record<string, string>, interTags: Record<string, string>) {
  return await request.post('/api/push/common/posttag', { data: {
    tags,
    extags,
    interTags,
  }})
}

