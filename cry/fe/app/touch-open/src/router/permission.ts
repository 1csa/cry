import router from './index';
import { useUserStore } from '@/store/moudles/user'

export default function createPermissionGuard() {
  router.beforeEach(async (to, from, next) => {
    if (await useUserStore().isUserLogged()) {
      next();
    }
  });
  // 详情页滚动条回到顶部
  router.afterEach((to, from) => {
    if (to.meta.isMenu === false) {
      window.scrollTo(0,0)
    }
  })
}
