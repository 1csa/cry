import { defineStore } from 'pinia';
import { fetchUserAuth, fetchCurrentUser } from '@/services/user';

type StateType = {
  islogin: boolean;
  userInfo: {
    name: string;
    avatar: string;
    email: string;
    userid: string;
  },
  authList: string[]
}
export const useUserStore = defineStore({
  id: 'app-user',
  state: (): StateType => ({
    islogin: false,
    // user info
    userInfo: {
      name: '未登录',
      avatar: '',
      email: '',
      userid: ''
    },
    // 权限列表
    authList: []
  }),
  getters: {

  },
  actions: {
    // getUser
    async getUserLogged() {
      try {
        const res = await fetchCurrentUser();
        if (res.status === 'success') {
          this.userInfo = res.user;
          return true
        }
      } catch (error) {
        return false;
      }
    },

    // 获取潘多拉权限
    async getUserAuth() {
      try {
        const res = await fetchUserAuth();
        if (res.status === 'success') {
          this.authList = res.result;
          return true
        } else {
          return false
        }
      } catch (error) {
        return false;
      }

    },

    redirectToLogin() {
      const loginUrl = '//pandora.yidian-inc.com/tools/admin/login';
      const cbUrl = location.href;
      location.href = `${loginUrl}?callback=${cbUrl}`;
    },

    // 是否登录
    async isUserLogged() {
      if (!this.islogin) {
        if (!(await this.getUserLogged() && await this.getUserAuth())) {
          this.islogin = false
          this.redirectToLogin();
          return
        } else {
          this.islogin = true
        }
      }
      return true
    },
  },
});
