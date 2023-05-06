// const BASE_URL = 'http://a4-1.go2yd.com/Website'; // 测试
const BASE_URL = 'http://a4.go2yd.com/Website';
const CPP_BASE_URL = 'http://cl-k8s.yidian-inc.com/apis/cpp-doc'; // 线上
// const CPP_BASE_URL = 'http://cl-k8s-staging.yidian-inc.com/apis/cpp-doc'; // 测试
export const UPLOAD_URL = 'http://zeus.v.yidian-inc.com/api/app/common/upload';
const API: {[api: string]: string} = {
  // 丹锋组提供
  'talk-create': `${BASE_URL}/talk/talk-create`,
  'talk-edit': `${BASE_URL}/talk/talk-edit`,
  'talk-list': `${BASE_URL}/talk/talk-list-by-fromid`,
  'change-status': `${BASE_URL}/talk/change-status`,
  'save-topping-talk': `${BASE_URL}/talk/save-topping-talk`,
  'topping-talk-list': `${BASE_URL}/talk/topping-talk-list`,
  'doc_list': `${BASE_URL}/talk/list`,
  'doc_sticky': `${BASE_URL}/talk/sticky`,
  'doc_unsticky': `${BASE_URL}/talk/un-sticky`,
  // 武文韬提供
  'add_doc': `/api/doc/saveDocToTopic`,
  'delete_doc': `/api/proxy/${CPP_BASE_URL}/prv/document/delete`,
  'recover_doc': `/api/proxy/${CPP_BASE_URL}/prv/document/recover`,
  // 查询doc keywords
  'search_doc_by_keyword': `/api/doc/searchDocsByKeyword`,
  'search_doc_by_docid': `/api/doc/searchDocsByDocids`,
}
/**
 * http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=51392378 删除和恢复文章接口说明文档
 */
/*cpp文档: https://cl-k8s.yidian-inc.com/swagger-ui/?
url=/apis/cpp-doc/v2/api-docs#/document-controller/updateUsingPOST
*/
export default API;
