/**
 * 未登陆未验证 | 已登陆未验证 | 已登陆已验证
 */
export type UserStatus = "UN_CHECK" | "UN_LOGIN" | "UN_AUTH" | "AUTH"

/**
 * @param uid 用户id
 * @param email 用户邮箱
 * @param username 用户昵称
 * @param authes 用户权限
 * @param userStatus 用户状态
 */
export interface UserModelState {
  uid: string;
  email: string;
  username: string;
  authes: string[];
  status: UserStatus;
}
