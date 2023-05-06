/*
 * @Author: wuhuimin
 * @Company:
 * @功能: 页面缓存
 * @Date: 2022-04-27 17:28:17
 * @LastEditTime: 2022-04-28 17:19:34
 */
import { defineStore } from 'pinia';
import { RouteRecordName } from 'vue-router';

declare type RouteName = RouteRecordName | null | undefined;

interface StateType {
  caches: RouteName[]
}

interface GettersType {
  caches: string[]
}
export const useKeepAliveStore = defineStore({
  id: 'keep-alive',
  state: (): StateType => ({
    // 缓存列表
    caches: []
  }),
  getters: {
    getCaches(): RouteName[] {
      return this.caches;
    },
  },
  actions: {
    ADD(name: RouteName) {
      if (this.caches.indexOf(name) < 0) {
        this.caches.push(name)
      }
    },
    REMOVE(name: RouteName) {
      this.caches = this.caches.filter(item => item != name);
    },
    CLEAN() {
      this.caches = [];
    }
  }
});
