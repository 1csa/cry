import request from '@/utils/request'
import appConfig from '@/config/app/app.config'
import { PushFormProps } from '@/config/pushForm/push'

// 获取 推送历史
export async function getPushHistory (): Promise<any> {
  return request.get(`/api/editor_push/getPushHistory`)
}

// 暂停推送
export async function handlePause (pushID: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PAUSE_HOST}/pause/${pushID}`)
}

// 继续推送
export async function handleContinue (pushID: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PAUSE_HOST}/continue/${pushID}`)
}

// 编辑后推送
export async function rename (pushID: string, title: string, summary: string): Promise<any> {
  return request.get(`/api/proxy/${appConfig.PAUSE_HOST}/rename?pushId=${pushID}&newTitle=${encodeURIComponent(title)}&newSummary=${encodeURIComponent(summary)}`)
}

// 保存常用标签
export async function saveEditorTag (values: {[key: string]: any}): Promise<any> {
  return request.post(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/editor/update-editor-tags`, {
    data: values
  })
}

// 获取 用户信息
export async function getEditorInfo (): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/editor/get-editor-info`)
}

// 获取 rstyle list
export async function getRstypeList (): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/editor/get-rstype-list`)
}

// 获取 tv channel list
export async function getTvChannelList (): Promise<any> {
  return request.get(`/api/proxy/http://183.192.162.159:8080/mcnoutput/solr/search?accessId=300261&firstClassify=500020&limit=100&start=0&nsukey=MEbwHLkAqE9gfwSmQWnBNVTWYSm6e8R3fJ0J3J3UQGJes%2BXyO%2FNsZmt9ZfuQAuTxEgg%2B2%2BTpdydTssgip7vstlRuBLKaqX2EgADAbh8mfMvvKvT7n6qv3Z1UfwZYbbw6x3CMpOaJt98Lo0qCQ%2FkedKAgvDT096iJX99UwNEAcbN87VUd0SYJ2Oz5wPDntbuuIwoqZnmvcTcT1lq%2BoPxAkw%3D%3D`)
}

// 根据 docid 获取 文章信息
export async function getArticleInfo (docid: string): Promise<any> {
  return request.get(`/api/editor_push/getArticleInfoByDocid?docid=${docid}`)
}

// 上传图片
export async function uploadPushImage (formData: any, type: string = ''): Promise<any> {
  // console.log('before upload', formData)
  return request.post(`/api/editor_push/uploadPushImage?type=${type}`, {
    data: formData,
  })
}

// 获取 category list
export async function getCategoryList (): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/editor/get-cate-list`)
}

// 获取 用户层级
export async function getUserLayerChannelList (): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/editor/get-layer-list`)
}

// 获取 sync_platform list
export async function getSyncPlatformList (): Promise<any> {
  return request.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/editor/get-sync-platform-list`)
}

// 获取 appid list
export async function getAppidList (): Promise<any> {
  return request.get(`/api/editor_push/getPushtypeEnum`)
}

// 获取 app group
export async function getAppGroupList (): Promise<any> {
  return request.get(`/api/proxy/${appConfig.OLD_PUSH_API_HOST}/push/get_push_in_apps.php`)
}

// 复检
export async function getDuplicateCheck (docid: string, title: string, summary: string): Promise<any> {
  return request.get(`/api/editor_push/getDuplicateCheck?docid=${docid}&title=${title}&summary=${summary}`)
}

// 推送
export async function pushNews (values: PushFormProps, isTest: boolean, isForce: boolean): Promise<any> {
  return request.post(`/api/editor_push/pushNews?isForce=${isForce}&isTest=${isTest}`, {
    data: values
  })
}
