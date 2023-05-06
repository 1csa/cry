import { EditorAuthes } from './account';

export const InitialUserAuth: EditorAuthes = {
  permission: [],
  push_key: '',
  channels: {},
  exclude_channels: {}
}

//老版工具权限（http://pandora.yidian-inc.com/tools/auth/index?tool=247）
/* export const Auth_Visit = 247;                                  // 老版工具根权限
export const Auth_Remove_Title_Limit = 248;                     // 去除标题字数限制
export const Auth_Delevery_Emergency = 303                      // 分发紧迫性及过期时间选项
export const Auth_Account_Manager = 316;                        // 账号管理
export const Auth_Delevery_Range = 329;                         // 分发范围
export const Auth_Push_Hotpot = 331;                            // 热点脉络
export const Auth_Emergency_Push = 333;                         // 紧急push
export const Auth_Vivo_Push = 346;                              // vivo 推送相关 --停用
export const Exclude_Tag = 'exclude_tag'    */                     // 排除标签

// 新版工具权限（http://pandora.yidian-inc.com/tools/auth/index?tool=3541078614）

export const Auth_Account_Manager = 'account_management';         // 账号管理
export const Exclude_Tag = 'eliminate_tag'                        // 排除标签
export const Auth_Remove_Title_Limit = 248;                       // 去除标题字数限制
